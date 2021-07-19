import Timer from './timer.js'
import { AudioPlayer } from './audio.js'
//import { VideoPlayer } from './video_player'
import { PLAYLIST, LAST_SONGS_PLAYLIST } from './playlist.js'
import { getNextFont, NUMBER_OF_TEXT_AREA } from './font-list'
import SVGTextAnimate from '../vendors/svg-text-animate-fork/src/svg-text-animate.js'

// Firebase database const
const DEBUG_MUTE = false // Default = false; true if you don't want the sound
const timeBeforeLastSongs = 4 * 60 * 1000 + 52 * 1000 + 12 * 1000 // 4 Minute 52 + 12s (7s of delay + 5s of dropdown song)
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

class CountDown {
  constructor() {
    this.countDownOver = false

    // Flag to now if we have to switch to last songs playlist (linked to timeBeforeLastSongs)
    this.switchToLastsSongs = false
    // Flag to now if we have to reset the index of playlist
    this.resetIndexPlayList = false

    this.index = +localStorage.getItem('songIndex') ?? 0

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
    // this.videoPlayer = new VideoPlayer(opacityElt, () => {
    //   // console.debug('end');
    //   setTimeout(() => {
    //     // TODO (SHOW FINAL IMAGE)
    //   }, 5000)
    // })
  }

  /**
   * Give the next area configuration (could create the dom node)
   * @returns an object with configuration of textArea
   */
  _getNextArea() {
    this.indexColor = (this.indexColor + 1) % COLORS.length
    const id = `draw-area${this.indexAreaText}`
    if (this.areaTextElt.length === 0 || this.indexAreaText > this.areaTextElt.length - 1) {
      const textElt = document.createElement('DIV')
      textElt.classList.add('draw-area-text')
      textElt.id = id
      document.querySelector('.draw-area').appendChild(textElt)
      this.areaTextElt.push(textElt)
    }

    // Tune position and orientation of text area
    const areaElt = this.areaTextElt[this.indexAreaText]
    const index = this.indexAreaText
    const topPercent = Math.floor(Math.random() * 40) + 1
    const leftPercent = 10 + (Math.floor(Math.random() * 40) + 1)
    const roateDeg = (this.indexAreaText % 2 === 0 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1)
    areaElt.style.top = `${topPercent}%`
    areaElt.style.left = `${leftPercent}%`
    areaElt.style.transform = `rotate(${roateDeg}deg)`
    document.querySelector('.draw-area').removeChild(areaElt)
    document.querySelector('.draw-area').appendChild(areaElt)

    this.indexAreaText = (this.indexAreaText + 1) % NUMBER_OF_TEXT_AREA

    return {
      index: index,
      elt: areaElt,
      selector: `#${id}`,
      color: COLORS[this.indexColor],
    }
  }

  drawText(textToDraw) {
    const textArea = this._getNextArea()
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
        fill: textArea.color,
        stroke: textArea.color,
        'stroke-width': fontToUse['stroke-width'],
        'font-size': 130 * fontToUse['font-size-multiplier'],
      },
    )

    //await fontInSVG.setFont()
    fontInSVG.setFont().then((_) => {
      fontInSVG.create(sanitizeText, textArea.selector)
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
      const index = (this.index + 1) % playlistToUse.length
      localStorage['songIndex'] = index
      resolve({
        songToPlay: playlistToUse[index],
        index: index,
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
      .loadSong(`./assets/songs/${objectSong.songToPlay.path}`, objectSong.songToPlay.song)
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
        // this.videoPlayer.resetVideo()
        const opacityElt = document.getElementById('opacity')
        opacityElt.style.display = ''
        setTimeout(() => {
          opacityElt.classList.add('black')
          //setTimeout(() => this.videoPlayer.playVideo(), 4000)
        }, 100)
        break
    }
  }
}

export default CountDown
