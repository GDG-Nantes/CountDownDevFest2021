import Game from './game.js'
import { getNextFont } from './font-list'
import SVGTextAnimate from '../vendors/svg-text-animate-fork/src/svg-text-animate.js'

document.addEventListener('DOMContentLoaded', () => {
  // We check if the url contains Hash "countdown" to know if we're on countdown mode
  const countDownMode = location.hash && location.hash === '#countdown'
  // We set a special class according to mode to hide or show some elements of the page
  document
    .getElementById('game-canvas')
    .classList.add(countDownMode ? 'countdown-mode' : 'mobile-mode')

  // We init the engine
  let game = new Game(countDownMode)
  let fullscreenMode = false

  // We watch for close instructions click to start the game
  const instructionElt = document.querySelector('.instructions')

  const inputElt = document.getElementById('pseudo')
  if (countDownMode) {
    inputElt.setAttribute('type', 'password')
  }

  inputElt.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      startScreenGame()
    }
  })

  /**
   * PROOF
   */
  //initWebSocketConnexion();

  const textArea = document.body.querySelector('#draw-text')
  const docalisme = new SVGTextAnimate(
    './css/fonts/Y-Yo_Tags.ttf',
    {
      duration: 100,
      direction: 'normal',
      'fill-mode': 'forwards',
      //delay: 150,
      mode: 'sync', //'onebyone',
    },
    {
      fill: '#20ae94',
      stroke: '#20ae94',
      'stroke-width': '0px',
      'font-size': 100,
    },
  )

  //await docalisme.setFont()
  docalisme.setFont().then((_) => {
    docalisme.create('abct mon 1-9 !@#', '#draw-text')
  })

  /**
   * END PROOF
   */

  function startScreenGame() {
    const input = inputElt.value
    game.setPseudo(input)

    if (!input || input.length === 0 || input.trim().length === 0) {
      document.getElementById('error-message').style.display = ''
      return
    }

    // we check if the pwd is correct of if the user enter a name
    if (countDownMode) {
      /*fetch(`https://us-central1-devfesthero.cloudfunctions.net/app/pwd?pwd=${input}`).then(res => {
        if (res.status === 200) {
          instructionElt.style.display = 'none'
          game.startSong()
          toggleFullScreen()
        } else {
          document.getElementById('error-pwd').style.display = ''
        }
      })*/
    } else if (input && input.length > 0) {
      instructionElt.style.display = 'none'
      //game.startSong()
      // We listen to change in firebase to change of song
      game.listenToChange()
      toggleFullScreen()
    }
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
    const sanitizeText = textToDraw.replace(/[^a-zA-Z]/, '')
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
