import Timer from './timer.js'
import { AudioPlayer } from './audio.js'
import { VideoPlayer } from './video_player'
import { PLAYLIST, LAST_SONGS_PLAYLIST } from './playlist.js'
import { getNextFont, NUMBER_OF_TEXT_AREA } from './font-list'
import SVGTextAnimate from '../vendors/svg-text-animate-fork/src/svg-text-animate.js'

const DEBUG_MUTE = true // Default = false; true if you don't want the sound
//const timeBeforeLastSongs = 4 * 60 * 1000 + 8 * 1000 + 5 * 1000 // 4 Minute 08 + 5s of dropdown song // MOP
const timeBeforeLastSongs = 4 * 60 * 1000 + 52 * 1000 + 5 * 1000 // 4 Minute 52 + 5s of dropdown song // ACDC
const dropTimeForLastSong = 5 * 1000 // 5 sec
const COLORS = [
  '#20ae94', //green cyan
  '#f1d469', //yellow
  '#ec6453', //red
  '#2a4d89', //blue
  '#673ab7', //purple
  '#ff9800', //orange
  '#8bc34a', //green
]
const BRUSH = [
  {
    name: 'brush-1.svg',
    ratioHeight: 268 / 1001,
    ratioWidth: 1001 / 268,
  },
  {
    name: 'brush-stroke-banner-1-resize.svg',
    ratioHeight: 366 / 1001,
    ratioWidth: 1001 / 366,
  },
  {
    name: 'brush-stroke-banner-5-resize.svg',
    ratioHeight: 305 / 1024,
    ratioWidth: 1024 / 305,
  },
  {
    name: 'brush-stroke-banner-7-resize.svg',
    ratioHeight: 237 / 1000,
    ratioWidth: 1000 / 237,
  },
  {
    name: 'banner-2-resize.svg',
    ratioHeight: 187 / 1001,
    ratioWidth: 1001 / 187,
  },
]
const HASHTAG = 'devfestgraf'
// Duration for write 1 letter
const DURATION_ONE_LETTER = 600
// Delay between each letter draw
const DELAY_BETWEEN_LETTERS = 150
class CountDown {
  constructor() {
    this.countDownOver = false

    // Flag to now if we have to switch to last songs playlist (linked to timeBeforeLastSongs)
    this.switchToLastsSongs = false
    // Flag to now if we have to reset the index of playlist
    this.resetIndexPlayList = false

    this.songIndex = +localStorage.getItem('songIndex') ?? 0

    // List of area element where we draw text
    this.areaTextElt = []
    this.indexAreaText = 0
    this.indexColor = 0

    // We init the Audio player
    this.audioPlayer = new AudioPlayer()
    // Timer html
    this.timerElt = document.querySelector('.countdown')
    // We start the timer (countdwon)
    this.timer = new Timer(this.callbackTimer.bind(this))

    // the html element that will be blank when we start the video
    const opacityElt = document.getElementById('opacity')
    // We init the video player
    this.videoPlayer = new VideoPlayer(opacityElt, () => {
      // console.debug('end');
      setTimeout(() => {
        // TODO (SHOW FINAL IMAGE)
      }, 5000)
    })
  }

  /**
   * Give the next area configuration (could create the dom node)
   * @param {string} text
   * @param {string} credits
   * @returns an object with configuration of textArea
   */
  _getNextArea(text, credits) {
    this.indexColor = (this.indexColor + 1) % COLORS.length
    const id = `draw-area${this.indexAreaText}`

    // We define the background brush to use
    const brushToUse = BRUSH[Math.floor(Math.random() * BRUSH.length)]
    // Creation if not exist of background div
    if (this.areaTextElt.length === 0 || this.indexAreaText > this.areaTextElt.length - 1) {
      const containerElt = document.createElement('DIV')

      const svgBGElt = document.createElement('div')
      svgBGElt.classList.add('draw-area-svg-bg')
      const svgImgBGElt = document.createElement('IMG')
      svgImgBGElt.src = `./assets/images/${brushToUse.name}`
      svgBGElt.appendChild(svgImgBGElt)
      const textElt = document.createElement('DIV')
      textElt.classList.add('draw-area-text')
      textElt.id = id
      textElt.dataset.credits = credits.toLocaleUpperCase()
      containerElt.appendChild(svgBGElt)
      containerElt.appendChild(textElt)
      document.querySelector('.draw-area').appendChild(containerElt)
      this.areaTextElt.push(containerElt)
    }

    // Tune position and orientation of text area
    const areaElt = this.areaTextElt[this.indexAreaText]
    const index = this.indexAreaText
    const topPercent = Math.floor(Math.random() * 50) + 1
    const leftPercent = 5 + (Math.floor(Math.random() * 30) + 1)
    const rotateDeg = (this.indexAreaText % 2 === 0 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1)
    areaElt.classList.add('draw-area-container')
    areaElt.style.top = `${topPercent}%`
    areaElt.style.left = `${leftPercent}%`
    areaElt.style.transform = `rotate(${rotateDeg}deg)`
    areaElt.style.color = COLORS[this.indexColor]
    areaElt.style.setProperty(
      '--timing',
      `${text.length * ((3 * DURATION_ONE_LETTER + 3 * DELAY_BETWEEN_LETTERS) / 1000)}s`,
    )

    // We define the alteration of svg image background
    areaElt
      .querySelector('.draw-area-svg-bg img')
      .style.setProperty('--filter-svg', `invert(${Math.floor(Math.random() * 5)}%)`)

    // We force the reinitialisation of area
    document.querySelector('.draw-area').removeChild(areaElt)
    document.querySelector('.draw-area').appendChild(areaElt)

    this.indexAreaText = (this.indexAreaText + 1) % NUMBER_OF_TEXT_AREA

    return {
      index: index,
      elt: areaElt,
      brush: brushToUse,
      svgBgElt: areaElt.querySelector('.draw-area-svg-bg'),
      selector: `#${id}`,
      color: COLORS[this.indexColor],
    }
  }

  /**
   * Sanitize the input text by removing accents and specials chars
   * @param {string} text
   * @returns the text sanitized
   */
  _sanitize(text) {
    const unAccentText = text.normalize('NFD').replace(/\p{Diacritic}/gu, '')
    const authorizedChar = unAccentText.toLowerCase().replace(/[^a-zA-Z0-9#@!,?=' ]/, '')
    const withoutHash = authorizedChar.replace(`#${HASHTAG}`, '').replace(HASHTAG, '')
    return withoutHash.length > 25 ? `${withoutHash.slice(0, 25)}...` : withoutHash
  }

  /**
   * Detect the constraints of text (use of number, use of specials chars)
   * @param {string} text
   * @returns the object of font constraints
   */
  _detectConstraints(text) {
    const regExpNumbers = /.*[0-9].*/
    const regExpUppercase = /.*[A-Z].*/
    const regExpSpecialChar = /.*[\.@#=!?,'].*/
    return {
      withSpecialChars: regExpSpecialChar.test(text),
      withUppercase: regExpUppercase.test(text),
      withNumbers: regExpNumbers.test(text),
    }
  }

  /**
   * Will display, sanitize a text and transform it to svg
   * @param {string} textToDraw
   * @param {string} credits
   */
  drawText(textToDraw, credits) {
    const sanitizeText = this._sanitize(textToDraw)
    const textArea = this._getNextArea(sanitizeText, credits)
    const fontToUse = getNextFont(this._detectConstraints(sanitizeText))
    const fontInSVG = new SVGTextAnimate(
      `./css/fonts/${fontToUse.fontFile}`,
      {
        duration: DURATION_ONE_LETTER,
        direction: 'normal',
        'fill-mode': 'forwards',
        delay: DELAY_BETWEEN_LETTERS,
        mode: 'onebyone',
      },
      {
        fill: textArea.color,
        stroke: textArea.color,
        'stroke-width': fontToUse['stroke-width'],
        'font-size': 100 * fontToUse['font-size-multiplier'],
      },
    )
    fontInSVG.setFont().then((_) => {
      // Creation of svg based on the text
      fontInSVG.create(sanitizeText, textArea.selector)

      const svgTextElt = document.querySelector(`${textArea.selector} svg`)
      // we retreive size of svg to inject it in img
      const widthFromSVG = +svgTextElt.style.getPropertyValue('--width-svg')
      const heightFromSVG = +svgTextElt.style.getPropertyValue('--height-svg')
      let widthSVG = widthFromSVG * 1.2
      let heightSVG = widthSVG * textArea.brush.ratioHeight

      if (heightSVG < heightFromSVG * 1.2) {
        heightSVG = heightFromSVG * 1.2
        widthSVG = heightSVG * textArea.brush.ratioWidth
      }

      const svgBgElt = textArea.svgBgElt
      svgBgElt.style.setProperty('--height-svg', `${heightSVG}px`)
      svgBgElt.style.setProperty('--width-svg', `${widthSVG}px`)
      svgBgElt.parentElement.style.setProperty('--width-svg', `${widthSVG}px`)
      const imgSvgBgElt = svgBgElt.querySelector('img')
      imgSvgBgElt.width = widthSVG
      imgSvgBgElt.height = heightSVG

      setTimeout(() => {
        // We finaly display the svg
        svgTextElt.classList.add('show')
      }, 600)
    })
  }

  /**
   * Load the midi object, load the ogg files according to objectSong parameter
   *
   * Return a Promise with objectSong as response (to chain Promise)
   * @param {Object} objectSong
   */
  loadSong(objectSong) {
    return this.loadMusic(objectSong)
  }

  /**
   * Save or get the current song
   * Syncrhonise the current time to the countdown and ask to play the song
   *
   */
  playSongAndDisplayNote() {
    // We only play the song in countdown mode
    // as we create a delay before the start of song (timeout) we wait for the right time to start the song
    this.playSongAtTime(this.startSong.bind(this))
  }

  /**
   *
   * this method is call at every RequestAnimationFrame to start the song at the right moment
   *
   * @param {function} callback : the callback to call when the song is over
   */
  playSongAtTime(callback) {
    this.playMusic(callback)
  }

  /**
   * Start a song :
   * 1. get the song to play
   * 2. load song
   * 3. play it
   *
   *
   */
  startSong() {
    if (this.countDownOver) {
      return
    }
    // We frst request server to get the right song to play
    this.queryCurrentSongOrTakeFirst()
      .then((objectSong) => this.loadSong(objectSong))
      .then((_) => this.playSongAndDisplayNote())
  }

  /**
   * If we're in countdown :
   * if nextSong === true -> we look at the next song in playlist
   * else -> we take the song on the server
   * If no song on the server -> we take the first of the playlist
   *
   * If we're on a device :
   * we take the song on the server
   *
   * @param {boolean} nextSong
   */
  queryCurrentSongOrTakeFirst(nextSong) {
    return new Promise((resolve, reject) => {
      // If we're in the delay to play the last song, we switch to last song playlist
      const playlistToUse = this.switchToLastsSongs ? LAST_SONGS_PLAYLIST : PLAYLIST
      // we check if we have to take the next song
      this.songIndex = (this.songIndex + 1) % playlistToUse.length
      localStorage['songIndex'] = this.songIndex
      resolve({
        songToPlay: playlistToUse[this.songIndex],
        index: this.songIndex,
      })
    })
  }

  /**
   * Start the song and will call the callback when the song is terminated
   *
   * @param {function} callbackEndMusic
   */
  playMusic(callbackEndMusic) {
    return this.audioPlayer.play(DEBUG_MUTE, callbackEndMusic)
  }

  /**
   * Load the song in the player (only for countdown)
   *
   * @param {*} objectSong
   */
  loadMusic(objectSong) {
    // We only play music if we have the countdown
    return this.audioPlayer
      .loadSong(`./assets/songs/`, objectSong.songToPlay.song)
      .then((_) => objectSong)
  }

  /**
   * method called when the timer send events
   *
   * @param {string} state
   */
  callbackTimer(state) {
    switch (state.type) {
      case 'time':
        // TODO
        this.timerElt.innerHTML = `${state.value.minutes}:${state.value.seconds}`
        //this.gameView.setTime(state.value)
        // If we're in the last song delay, we first drop the sound of current sound before
        if (
          state.value.diff < timeBeforeLastSongs &&
          state.value.diff > timeBeforeLastSongs - dropTimeForLastSong
        ) {
          const adjustDiff = state.value.diff - (timeBeforeLastSongs - dropTimeForLastSong)
          this.audioPlayer.manageVolumeFromPercent(adjustDiff / dropTimeForLastSong)
        } else if (state.value.diff < timeBeforeLastSongs && !this.switchToLastsSongs) {
          this.switchToLastsSongs = true
          this.audioPlayer.stop()
          this.audioPlayer.manageVolumeFromPercent(100)
          this.startSong()
        } else if (this.audioPlayer) {
          this.audioPlayer.manageSoundVolume(state.value.diff)
        }
        break
      case 'endCountDown':
        console.log('Times Up !')
        this.countDownOver = true
        // Stop Music
        this.audioPlayer.stop()
        this.videoPlayer.resetVideo()
        const opacityElt = document.getElementById('opacity')
        opacityElt.style.display = ''
        setTimeout(() => {
          opacityElt.classList.add('black')
          setTimeout(() => this.videoPlayer.playVideo(), 4000)
        }, 100)
        break
    }
  }
}

export default CountDown
