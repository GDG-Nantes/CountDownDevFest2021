const functions = require('firebase-functions')
const express = require('express')
const cookieParser = require('cookie-parser')()
const cors = require('cors')
const app = express()
const admin = require('firebase-admin')
admin.initializeApp()

app.use(
  cors({
    origin: '*',
  }),
)
app.use(cookieParser)

app.get('/pwd', cors({ origin: '*' }))
app.use('/pwd', (req, res) => {
  if (req.query.pwd && req.query.pwd === 'devfest19=io') {
    res.status(200).send('')
  } else {
    res.status(403).send('')
  }
})

exports.app = functions.https.onRequest(app)
