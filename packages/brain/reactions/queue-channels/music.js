/**
 * Music Handler
 * @memberof queue-channels
 */

// Capabilities
import Speak from '../../communication'
// Utils
import maxBy from 'lodash.maxby'
import logger from 'hoopa-logger'

const greetings = ['Hi There!', 'Hi muchacho!', 'Hellow there!', `What's up?!`]

const startSong = async ({ data, options }, { player, instance }, term) => {
  const choosedSong = maxBy(data, 'popularity')

  if (choosedSong.name) {
    const songGreeting = greetings[Math.floor(Math.random() * greetings.length)]
    const artist = choosedSong.artists[0].name
    await player.controls.setVoiceVolume(50, instance)

    const playSentence = `${songGreeting}. I've found a song related to ${term} from ${artist}, check it out...`

    await Speak(playSentence)

    if (options.play) {
      return player.controls.startPlaylist(choosedSong, instance, 'song')
    }
  }

  return logger.info(`Music service | end`)
}

/**
 * Parse Options from playlistObject
 * if needed
 * @param {*} playlistObject
 */
const mountOptions = ({ options }) => {
  let optionData = options || {}

  if (typeof options === 'string') {
    optionData = JSON.parse(options)
  }

  return optionData
}

/**
 * The music handler
 * @param {Object} coreProps
 * @param {Object} msg
 */
const musicHandler = async ({ player, instance }, { content }) => {
  const randomNumber = Math.floor(Math.random() * greetings.length)
  const greeting = greetings[randomNumber]
  const playlistObject = JSON.parse(content)
  const options = mountOptions(playlistObject)
  const { data } = playlistObject
  // Do smart search
  const smartSearchResult = await player.smartSearch(data, instance)
  // Calculate results quantity
  const results = smartSearchResult.data.length

  if (smartSearchResult.type === 'playlists') {
    const sentence = `${greeting} I've found ${results} playlists related to ${data}`
    const randomNumber = Math.floor(
      Math.random() * smartSearchResult.data.length
    )
    const contentToPlay = smartSearchResult.data[randomNumber] || player[0]

    await player.controls
      .setVoiceVolume(50, instance)
      .catch(error => logger.error(error))
    await Speak(sentence)

    logger.info(`Music service | ${data} | results: ${results}`)

    if (options.play) {
      const playSentence = `Now playing ${data} songs..`

      await Speak(playSentence)
      await player.controls.startPlaylist(contentToPlay, instance)

      player.controls.setVoiceVolume(100, instance)
    }

    return logger.info(`Music service | end`)
  } else {
    // Song recognized
    return startSong(
      { data: smartSearchResult.data, options },
      { player, instance },
      data
    )
  }
}

export default musicHandler
