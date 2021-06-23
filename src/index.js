import Game from './game.js'
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
  const textArea = document.body.querySelector('#draw-text')
  const docalisme = new SVGTextAnimate(
    './css/fonts/SlimWandals_PERSONAL.ttf',
    {
      duration: 600,
      direction: 'normal',
      'fill-mode': 'forwards',
      delay: 150,
      mode: 'onebyone',
    },
    {
      fill: '#20ae94',
      stroke: '#20ae94',
      'stroke-width': '2px',
      'font-size': 80,
    },
  )

  //await docalisme.setFont()
  docalisme.setFont().then((_) => {
    docalisme.create('Hello World', '#draw-text')
  })
  const opensans = new SVGTextAnimate(
    './css/fonts/docallismeonstreet.otf',
    {
      duration: 600,
      direction: 'normal',
      'fill-mode': 'forwards',
      delay: 150,
      mode: 'onebyone',
    },
    {
      fill: '#f1d367',
      stroke: '#f1d367',
      'stroke-width': '2px',
      'font-size': 80,
    },
  )

  opensans.setFont().then((_) => opensans.create('DevFest Rocks', '#draw-text2'))

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
})
