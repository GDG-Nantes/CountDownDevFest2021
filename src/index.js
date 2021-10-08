import CountDown from './countdown-engine.js'
import { TestFonts } from './test-fonts'

document.addEventListener('DOMContentLoaded', () => {
  // Only for tests
  if (location.pathname === '/index-test') {
    new TestFonts()
    return
  }

  document.querySelector('#start-button').addEventListener('click', (_) => startScreenGame())

  function startScreenGame() {
    // We init the engine
    let countdown = new CountDown()
    let fullscreenMode = false

    // Display elements
    document.querySelector('#start-button').style.display = 'none'
    document.querySelector('#game-canvas').style.display = 'block'

    const listWords = []

    countdown.startSong()
    //toggleFullScreen()

    /**
     * PROOF
     */
    initWebSocketConnexion(listWords)

    /*listWords.push([
      { text: 'Sàlût, le #monde!', author: 'jefbinomed' },
      { text: 'bienvenue en 2021', author: 'jefbinomed' },
      { text: "c'était mieux avant", author: 'jefbinomed' },
      { text: 'une phrase en 5 mots voir même plus', author: 'jefbinomed' },
      { text: '#devfestgraf, zut', author: 'jefbinomed' },
      { text: 'zut #devfestgraf', author: 'jefbinomed' },
      { text: 'encore 1 test', author: 'jefbinomed' },
      { text: 'ça rocks chez @gdgnantes', author: 'jefbinomed' },
    ])*/
    setInterval(() => {
      if (listWords.length > 0) {
        const tweet = listWords.shift()
        countdown.drawText(tweet.text, tweet.author)
      }
    }, 15000)
    //countdown.drawText('Zut', 'jefbinomed')
    //countdown.drawText('Hello World', 'jefbinomed')
    countdown.drawText('Un texte long avec 5 mots et plus de 26 caractères', 'jefbinomed')

    /**
     * END PROOF
     */
  }

  function toggleFullScreen() {
    const elem = document.getElementById('game-canvas')
    if (fullscreenMode) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen()
      }
    } else {
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen()
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen()
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen()
      }
    }
    fullscreenMode = !fullscreenMode
  }

  function initWebSocketConnexion(listWords) {
    const socket = io('ws://localhost:3001')
    socket.on('connect', () => {
      console.log('connected to ws')
    })
    socket.on('tweet', (json) => {
      try {
        if (json.data) {
          const text = json.data.text
          if (json.includes?.users) {
            for (let user of json.includes.users) {
              if (user.username !== 'DevfestGraffiti') {
                const text = json.data.text.substr(6 + user.username.length) // We remove 'RT @username: ' to keep the original tweet
                listWords.push({ text, author: user.username })
                return
              }
            }
          }
          //countdown.drawText(json.data.text)
          //console.log({ type: 'add_tweet', payload: json })
        }
      } catch (e) {
        console.error(e)
      }
    })
    socket.on('heartbeat', (data) => {
      console.log({ type: 'update_waiting' })
    })
    socket.on('error', (data) => {
      console.log({ type: 'show_error', payload: data })
    })
    socket.on('authError', (data) => {
      console.log('data =>', data)
      console.log({ type: 'add_errors', payload: [data] })
    })
  }
})
