import CountDown from './countdown-engine.js'
import { TestFonts } from './test-fonts'

document.addEventListener('DOMContentLoaded', () => {
  // Only for tests
  if (location.pathname === '/index-test') {
    new TestFonts()
    return
  }

  // We init the engine
  let countdown = new CountDown()
  let fullscreenMode = false

  /**
   * PROOF
   */
  //initWebSocketConnexion();

  setInterval(() => {
    const list = [
      'Sàlût, le #monde!',
      'bienvenue en 2021',
      "c'était mieux avant",
      'une phrase en 5 mots',
      '#devfestgraf, zut',
      'zut #devfestgraf',
      'encore 1 test',
      'ça rocks chez @gdgnantes',
    ]
    countdown.drawText(list[Math.floor(Math.random() * list.length)], 'jefbinomed')
  }, 15000)
  countdown.drawText('Hello World', 'jefbinomed')

  /**
   * END PROOF
   */

  function startScreenGame() {
    countdown.startSong()
    toggleFullScreen()
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

  function initWebSocketConnexion() {
    const socket = io('ws://localhost:3001')
    socket.on('connect', () => {})
    socket.on('tweet', (json) => {
      if (json.data) {
        countdown.drawText(json.data.text)
        //console.log({ type: 'add_tweet', payload: json })
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
