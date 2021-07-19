import Game from './game.js'
import { getNextFont } from './font-list'
import SVGTextAnimate from '../vendors/svg-text-animate-fork/src/svg-text-animate.js'

document.addEventListener('DOMContentLoaded', () => {
  // We set a special class according to mode to hide or show some elements of the page
  document.getElementById('game-canvas')

  // We init the engine
  let game = new Game()
  let fullscreenMode = false

  /**
   * PROOF
   */
  //initWebSocketConnexion();

  setInterval(() => drawText('Hello World'), 15000)
  drawText('Hello World')

  /**
   * END PROOF
   */

  function startScreenGame() {
    game.startSong()
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
        drawText(json.data.text)
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

  function drawText(textToDraw) {
    // Detect Constraints
    // TODO
    const fontToUse = getNextFont({
      withSpecialChars: false,
      withNumbers: false,
    })
    // TODO better sanitize (to restrictive)
    const sanitizeText = textToDraw.toLowerCase().replace(/[^a-zA-Z ]/, '')
    const fontInSVG = new SVGTextAnimate(
      `./css/fonts/${fontToUse.fontFile}`,
      {
        duration: 600,
        direction: 'normal',
        'fill-mode': 'forwards',
        delay: 150,
        mode: 'onebyone',
      },
      {
        fill: '#20ae94', // TODO
        stroke: '#20ae94', // TODO
        'stroke-width': fontToUse['stroke-width'],
        'font-size': 100 * fontToUse['font-size-multiplier'],
      },
    )

    //await fontInSVG.setFont()
    fontInSVG.setFont().then((_) => {
      fontInSVG.create(sanitizeText, '#draw-text')
    })
  }
})
