const express = require('express')
const bodyParser = require('body-parser')
const util = require('util')
const request = require('request')
const path = require('path')
const socketIo = require('socket.io')
const http = require('http')
const config = require('./config.json')

/*
{
  "data": {
    "author_id": "1410947879024443393",
    "id": "1410951769711169537",
    "text": "RT @jefbinomed: As #GDE, I'm always wondering how to share content. Even if I give lots of talks, I wanted to go further and it's time for…"
  },
  "includes": {
    "users": [
      {
        "id": "1410947879024443393",
        "name": "DevfestGraffiti",
        "username": "DevfestGraffiti"
      },
      {
        "id": "104816107",
        "name": "J-F🐘GARRΞAU",
        "username": "jefbinomed"
      }
    ]
  },
  "matching_rules": [
    {
      "id": 1410949886963556400,
      "tag": ""
    }
  ]
}*/

const app = express()
let port = process.env.PORT || 3000
const post = util.promisify(request.post)
const get = util.promisify(request.get)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const server = http.createServer(app)
const io = socketIo(server)

const BEARER_TOKEN = config.bearer_token
const TWITTER_ACCOUNT = 'DevfestGraffiti'

let timeout = 0

const streamURL = new URL(
  'https://api.twitter.com/2/tweets/search/stream?tweet.fields=context_annotations&expansions=author_id',
)

const rulesURL = new URL('https://api.twitter.com/2/tweets/search/stream/rules')

const errorMessage = {
  title: 'Please Wait',
  detail: 'Waiting for new Tweets to be posted...',
}

const authMessage = {
  title: 'Could not authenticate',
  details: [
    `Please make sure your bearer token is correct. 
      If using Glitch, remix this app and add it to the .env file`,
  ],
  type: 'https://developer.twitter.com/en/docs/authentication',
}

const sleep = async (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), delay))
}

async function getRules() {
  return new Promise(async (resolve, reject) => {
    const token = BEARER_TOKEN
    const requestConfig = {
      url: rulesURL,
      auth: {
        bearer: token,
      },
      json: true,
    }

    try {
      const response = await get(requestConfig)

      if (response.statusCode !== 200) {
        if (response.statusCode === 403) {
          console.log('Error, ', response.body)
          reject()
        } else {
          reject(new Error(response.body.error.message))
        }
      }
      resolve(response.body)
    } catch (e) {
      reject(e)
    }
  })
}

async function cleanRules() {
  return new Promise(async (resolve, reject) => {
    const rules = await getRules()
    if (rules) {
      const ids = []
      for (let rule of rules.data) {
        ids.push(rule.id)
      }
      const token = BEARER_TOKEN
      const requestConfig = {
        url: rulesURL,
        auth: {
          bearer: token,
        },
        json: { delete: { ids: ids } },
      }

      try {
        const response = await post(requestConfig)

        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve()
        } else {
          reject(new Error(response))
        }
      } catch (e) {
        reject(e)
      }
    }
  })
}

async function setRules() {
  return new Promise(async (resolve, reject) => {
    const token = BEARER_TOKEN
    const requestConfig = {
      url: rulesURL,
      auth: {
        bearer: token,
      },
      json: { add: [{ value: `from:${TWITTER_ACCOUNT}` }] },
    }

    try {
      const response = await post(requestConfig)

      if (response.statusCode === 200 || response.statusCode === 201) {
        resolve()
      } else {
        reject(new Error(response))
      }
    } catch (e) {
      reject(e)
    }
  })
}

const streamTweets = (socket, token) => {
  console.log('Will stream tweets')
  let stream

  const config = {
    url: streamURL,
    auth: {
      bearer: token,
    },
    timeout: 31000,
  }

  try {
    const stream = request.get(config)

    stream
      .on('data', (data) => {
        try {
          const json = JSON.parse(data)
          console.log('Receive Data', json)
          if (json.connection_issue) {
            socket.emit('error', json)
            reconnect(stream, socket, token)
          } else {
            if (json.data) {
              socket.emit('tweet', json)
            } else {
              socket.emit('authError', json)
            }
          }
        } catch (e) {
          console.log('heartbeat')
          socket.emit('heartbeat')
        }
      })
      .on('error', (error) => {
        console.log('Error message', errorMessage)
        // Connection timed out
        socket.emit('error', errorMessage)
        if (errorMessage.detail !== 'Waiting for new Tweets to be posted...') {
          reconnect(stream, socket, token)
        }
      })

    socket.on('disconnect', () => {
      console.log('Disconnect')
      stream.abort()
    })
  } catch (e) {
    console.log('y a eu une erreur')
    socket.emit('authError', authMessage)
  }
}

const reconnect = async (stream, socket, token) => {
  timeout++
  stream.abort()
  await sleep(2 ** timeout * 1000)
  streamTweets(socket, token)
}

io.on('connection', async (socket) => {
  try {
    const token = BEARER_TOKEN
    io.emit('connect', 'Client connected')
    const stream = streamTweets(io, token)
  } catch (e) {
    io.emit('authError', authMessage)
  }
})

console.log('NODE_ENV is', process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')))
  app.get('*', (request, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
  })
} else {
  port = 3001
}

async function initTwitterApp() {
  await cleanRules()
  const rules = await getRules()
  console.log('GetRules, ', rules)
  let shouldSetRules = true
  if (rules && rules.data) {
    for (let rule of rules.data) {
      shouldSetRules = shouldSetRules && rule.value !== `from:${TWITTER_ACCOUNT}`
    }
  }

  if (shouldSetRules) {
    console.log('Will set new rules')
    await setRules()
  }
}

initTwitterApp()

server.listen(port, () => console.log(`Listening on port ${port}`))
