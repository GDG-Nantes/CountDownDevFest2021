// TODO FIX
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import undefined from 'firebase/firestore'
import Timer from './timer.js'
import { AudioPlayer } from './audio.js'
//import { VideoPlayer } from './video_player'
import { PLAYLIST, LAST_SONGS_PLAYLIST } from './playlist.js'

// Firebase database const
const COLLECTION_USERS = 'users'
const COLLECTION_SONGS = 'songs'
const DOCUMENT_CURRENT_SONG = 'currentSong'
// Number of note to show (1 -> 5) : default 3
const NOTE_TO_SHOW = 3
const DEBUG_MUTE = false // Default = false; true if you don't want the sound
const timeBeforeLastSongs = 4 * 60 * 1000 + 52 * 1000 + 12 * 1000 // 4 Minute 52 + 12s (7s of delay + 5s of dropdown song)
const dropTimeForLastSong = 5 * 1000 // 5 sec

class Game {
  constructor(countDownMode) {
    // True if we are on the main screen
    this.countDownMode = countDownMode

    this.countDownOver = false

    // Flag to now if we have to switch to last songs playlist (linked to timeBeforeLastSongs)
    this.switchToLastsSongs = false
    // Flag to now if we have to reset the index of playlist
    this.resetIndexPlayList = false
    // Default pseudo
    this.pseudo = 'anonymous'

    // Firebase Listener
    this.firebaseListenerForChangeOfScores = undefined

    // Init the database connection
    //TODO FIX
    //this.initFirebase()

    if (this.countDownMode) {
      // We init the Audio player
      this.audioPlayer = new AudioPlayer()
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
  }

  /**
   * Init the connection to firebase
   */
  initFirebase() {
    const firebaseConfig = {
      apiKey: 'AIzaSyDdTuuIeGVwsb2xNLjfUD88EzqBbk936k0',
      authDomain: 'devfest-graffiti.firebaseapp.com',
      databaseURL: 'https://devfest-graffiti.firebaseio.com',
      projectId: 'devfest-graffiti',
      appID: 'devfest-graffiti',
    }
    firebase.initializeApp(firebaseConfig)
    this.firestoreDB = firebase.firestore()
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
   * @param {Object} objectSong
   */
  playSongAndDisplayNote(objectSong) {
    // We ask or persist the current song
    this.persistOrGetSongToDataBase(objectSong).then(({ startCountDown }) => {
      // If we're on the countdown, we delay of 7s the start of the song
      const timeOut = this.countDownMode ? 7000 : 0
      // We get now of browser to compare it witb NTP now
      const now = Date.now()
      const nowNTP = new Date(this.timeSync.now())
      // if we're in countdown, we update the reald time of Start to inform all devices the time ref
      if (this.countDownMode) {
        this.firestoreDB
          .collection(COLLECTION_SONGS)
          .doc(DOCUMENT_CURRENT_SONG)
          .update({
            startCountDown: nowNTP.getTime() + timeOut,
          })
      }
      // TimeStart is the time when the song and notes should start
      const timeStart = this.countDownMode
        ? now + timeOut
        : now - (nowNTP.getTime() - startCountDown)
      // We configure the board
      this.gameView.addMovingNotes(objectSong, timeStart)
      // We only play the song in countdown mode
      if (this.countDownMode) {
        // as we create a delay before the start of song (timeout) we wait for the right time to start the song
        this.playSongAtTime(this.startSong.bind(this), timeStart)
      }
    })
  }

  /**
   *
   * this method is call at every RequestAnimationFrame to start the song at the right moment
   *
   * @param {function} callback : the callback to call when the song is over
   * @param {time} timeToStartToPlay  : the real time of start
   */
  playSongAtTime(callback, timeToStartToPlay) {
    if (Date.now() > timeToStartToPlay) {
      this.playMusic(callback)
    } else {
      window.requestAnimationFrame(() => this.playSongAtTime(callback, timeToStartToPlay))
    }
  }

  /**
   * Start a song :
   * 1. get the song to play
   * 2. load song
   * 3. play it
   *
   * @param {boolean} nextSong : true if we have to start the next song in playlist
   */
  startSong(nextSong) {
    if (this.countDownOver) {
      return
    }
    // Each time a song start, we reset the board
    this.gameView.resetScore()
    // We frst request server to get the right song to play
    this.queryCurrentSongOrTakeFirst(nextSong)
      // If we're in countdown mode, we listen to Highscore
      .then((objectSong) =>
        this.countDownMode ? this.listenToScoreForSong(objectSong) : objectSong,
      )
      .then((objectSong) => this.loadSong(objectSong))
      .then((objectSong) => this.playSongAndDisplayNote(objectSong))
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
    return this.firestoreDB
      .collection(COLLECTION_SONGS)
      .doc(DOCUMENT_CURRENT_SONG)
      .get()
      .then((currentSongSnapshot) => {
        // If we're in the delay to play the last song, we switch to last song playlist
        const playlistToUse = this.switchToLastsSongs ? LAST_SONGS_PLAYLIST : PLAYLIST
        // we check if we have to take the next song
        if (currentSongSnapshot.exists || (this.switchToLastsSongs && !this.resetIndexPlayList)) {
          const currentSongInFirebase = currentSongSnapshot.data()
          const index = nextSong
            ? (currentSongInFirebase.index + 1) % playlistToUse.length
            : currentSongInFirebase.index
          return {
            songToPlay: nextSong ? playlistToUse[index] : currentSongInFirebase.songToPlay,
            index: index,
          }
        } else {
          this.resetIndexPlayList =
            this.resetIndexPlayList || (this.switchToLastsSongs && !!this.resetIndexPlayList)
          return {
            songToPlay: playlistToUse[0],
            index: 0,
          }
        }
      })
  }

  /**
   * Store in case of countdown the current song. At the end, return the song
   *
   * Get the song on server in case of device
   *
   * @param {Object} objectSong
   */
  persistOrGetSongToDataBase(objectSong) {
    // We only save datas of song (time of start) if we're on the countdown screen
    if (this.countDownMode) {
      return this.firestoreDB
        .collection(COLLECTION_SONGS)
        .doc(DOCUMENT_CURRENT_SONG)
        .set({
          songToPlay: objectSong.songToPlay,
          index: objectSong.index,
          timeStart: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((_) => this.firestoreDB.collection(COLLECTION_SONGS).doc(DOCUMENT_CURRENT_SONG).get())
        .then((currentSongSnapshot) => currentSongSnapshot.data())
    } else {
      return this.firestoreDB
        .collection(COLLECTION_SONGS)
        .doc(DOCUMENT_CURRENT_SONG)
        .get()
        .then((currentSongSnapshot) => currentSongSnapshot.data())
    }
  }

  /**
   * Listen to change of song to know what to show on screen
   */
  listenToChange() {
    // If we're not on countdown mode, we have to listen to change of songs
    this.firestoreDB
      .collection(COLLECTION_SONGS)
      .doc(DOCUMENT_CURRENT_SONG)
      .onSnapshot(
        {
          includeMetadataChanges: true,
        },
        (currentSongSnapshot) => {
          // Each time a change is done we look at it
          const dataWrite = currentSongSnapshot.data()
          // console.log('Receive change of song')
          // console.table(dataWrite)
          if (!dataWrite) {
            // We return if the currentSong doc was delete
            return
          }
          // Flag to now if the write of song was faster than the load of the song (midi)
          this.toFastForloadingSong = false
          // We display the correct name on screen
          this.gameView.resetSong()
          this.gameView.setCurrentSong(dataWrite, true)
          // by default, toFastForloadingSong is false
          this.toFastForloadingSong = !this.objectSongComplete
          // StartCountDown is an attribute only set when we know the time of start of a song
          // So, if it's false it means that we just know that a new song will be played and
          // we start to load it
          if (!dataWrite.startCountDown || !this.midiLoad) {
            this.midiLoad = true
            this.objectSongComplete = undefined
            this.loadSong(dataWrite).then((objectSong) => {
              // We store the object completed by midi informations
              this.objectSongComplete = objectSong
              if (this.toFastForloadingSong) {
                this.showNotesForPlayer()
              }
            })
            // nothing to do here
            return
          }

          this.showNotesForPlayer()
        },
      )
  }

  /**
   * Method that initialize the board (canvas)
   */
  createGameView() {
    // SCENE SIZE
    let width = window.innerWidth,
      height = window.innerHeight

    // CAMERA ATTRIBUTE
    let viewAngle = 75,
      aspect = width / height,
      near = 0.1,
      far = 10000

    let scene = new THREE.Scene()
    let camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far)

    camera.position.z = 150

    let renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)
    document.getElementById('game-canvas').appendChild(renderer.domElement)

    this.gameView = new GameView(
      renderer,
      camera,
      scene,
      this.key,
      this.touch,
      NOTE_TO_SHOW,
      this.incrementeScore.bind(this),
    )
    this.gameView.setup()
  }

  /**
   * Start the song and will call the callback when the song is terminated
   *
   * @param {function} callbackEndMusic
   */
  playMusic(callbackEndMusic) {
    if (this.countDownMode) {
      return this.audioPlayer.play(DEBUG_MUTE, callbackEndMusic)
    } else {
      return Promise.resolve()
    }
  }

  /**
   * Load the song in the player (only for countdown)
   *
   * @param {*} objectSong
   */
  loadMusic(objectSong) {
    // We only play music if we have the countdown
    if (this.countDownMode) {
      return this.audioPlayer
        .loadSong(`./assets/songs/${objectSong.songToPlay.path}`, objectSong.songToPlay.song)
        .then((_) => objectSong)
    } else {
      return Promise.resolve(objectSong)
    }
  }

  /**
   * method called when the timer send events
   *
   * @param {string} state
   */
  callbackTimer(state) {
    switch (state.type) {
      case 'time':
        this.gameView.setTime(state.value)
        // If we're in the last song delay, we first drop the sound of current sound before
        if (
          state.value.diff < timeBeforeLastSongs &&
          state.value.diff > timeBeforeLastSongs - dropTimeForLastSong
        ) {
          const adjustDiff = state.value.diff - (timeBeforeLastSongs - dropTimeForLastSong)
          this.audioPlayer.manageVolumeFromPercent(adjustDiff / dropTimeForLastSong)
        } else if (state.value.diff < timeBeforeLastSongs && !this.switchToLastsSongs) {
          this.switchToLastsSongs = true
          this.gameView.resetSong()
          this.audioPlayer.stop()
          this.audioPlayer.manageVolumeFromPercent(100)
          this.startSong(true)
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

export default Game
