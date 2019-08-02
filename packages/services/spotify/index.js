/**
 * Brianfy - The spotify handler
 * @memberof brian-ai
 */
import SpotifyWebApi from 'spotify-web-api-node'
import auth from 'spotify-personal-auth'
import maxBy from 'lodash.maxby'
import logger from 'hoopa-logger'
import { transactions } from 'rethinkly'
// Config
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@brian-ai/core/config'
// Capabilities
import Speak from '../../brain/communication'
import baseKnowledge from '../../brain/knowledge'
import { autobind } from 'core-decorators'

const cacheTokens = async ({ access, refresh }) => {
  const { getInstance } = baseKnowledge
  const dbInstance = await getInstance()

  transactions.insertData(dbInstance, 'tokens', [
    {
      type: 'access',
      token: access,
      provider: 'spotify',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      type: 'refresh',
      token: refresh,
      provider: 'spotify',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ])
}
/**
 * Initialize spotify web api
 * @param {String} access
 * @param {String} refresh
 */
const loadBrianfy = async (access, refresh, cached) => {
  const Brianfy = new SpotifyWebApi()
  Brianfy.setAccessToken(access)
  Brianfy.setRefreshToken(refresh)

  if (!cached) cacheTokens({ access, refresh })

  logger.info(`Loaded Brianfy with ${cached ? 'cached' : 'new'} credentials...`)

  return Brianfy
}

/**
 * Handle spotify authorization flow
 */
const authorize = () => {
  logger.info('Authorizing spotify...')

  auth.config({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    scope: [
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-top-read'
    ],
    path: './tokens'
  })

  return new Promise((resolve, reject) => {
    auth
      .token()
      .then(([token, refresh]) => {
        try {
          logger.info('Brianfy loaded!')

          resolve(loadBrianfy(token, refresh, false))
        } catch (err) {
          logger.info('Brianfy, authorization error...')

          reject(err)
        }
      })
      .catch(err => {
        logger.info(err.message)

        return Speak(
          `Excuse me, Sir! But something went wrong when retrieving an access token from spotify! <break time="0.2s"/>
					You should teach me how to code so I could fix that for you <break time="0.2s"/>
					I'm pretty  sure that the problem is ${err.message}
				`
        )
      })
  })
}

/**
 * Handle spotify player volume
 * @param {String} amount
 * @param {Object} instance
 */
const setVoiceVolume = async (amount = 30, instance) => {
  let newInstance = instance
  if (!instance) {
    newInstance = await authorize()
    logger.info('Getting spotify credentials')
  }

  try {
    logger.info(`Setting volume to: ${amount}`)
    newInstance.setVolume(amount)
  } catch (error) {
    return logger.error(`Spotify control service | volume error ${error}`)
  }
}

/**
 * Search for playlists into spotify library
 * @param {Brianfy} instance
 * @returns {Array} Playlists
 */
const findPlaylists = async (musicGenre = 'Jazz', instance) => {
  let newInstance = instance
  if (!instance) {
    newInstance = await authorize()
    logger.info('Getting spotify credentials')
  }

  logger.info('Loading spotify playlists...')

  return new Promise(async (resolve, reject) => {
    newInstance.searchPlaylists(musicGenre).then(
      data => {
        const searchResult = data.body.playlists
        const playlists = searchResult.items

        resolve(playlists)
      },
      error => {
        logger.error(error)

        reject(error)
      }
    )
  })
}

/**
 * Calculate the most popular item
 * @param {Array} items
 */
const analyzePopularity = items =>
  Math.max(
    ...items.map(o => {
      return o.popularity
    })
  )

/**
 * Search for playlists into spotify library
 * @param {Brianfy} instance
 * @returns {Array} Playlists
 */
const smartSearch = async ({ data = 'Cooking Jazz' }, instance) => {
  console.log('HERE', data)

  let newInstance = instance
  if (!instance) {
    newInstance = await authorize()
    logger.info('Getting spotify credentials')
  }

  logger.info('Spotify Smart Search...')

  return new Promise(async (resolve, reject) =>
    newInstance.search(data, ['track', 'playlist']).then(
      data => {
        const searchResult = data.body
        const playlists = searchResult.playlists.items
        const tracks = searchResult.tracks.items
        const tracksAveragePopularity = analyzePopularity(tracks)
        const mostPopularTrack = maxBy(tracks, 'popularity')

        if (
          tracksAveragePopularity > 75 ||
          mostPopularTrack.name.toLowerCase().includes(data)
        ) {
          resolve({ data: tracks, type: 'tracks' })
        }

        resolve({ data: playlists, type: 'playlists' })
      },
      error => {
        logger.error(error)

        reject(error)
      }
    )
  )
}

/**
 * Start a playlist into a desired player
 * @param {Brianfy} instance
 * @param {Object} playlist
 */
const startPlaylist = async (playlist, instance, type = 'playlist') => {
  let newInstance = instance
  if (!instance) {
    newInstance = await authorize()
    logger.info('Getting spotify credentials')
  }

  let options = {
    context_uri: playlist.uri
  }
  if (type === 'song') {
    options = {
      uris: [playlist.uri]
    }
  }

  newInstance
    .play({
      ...options
    })
    .catch(error => logger.error(error))

  logger.info(`${playlist.name} started`)

  return setVoiceVolume(100, newInstance)
}

/**
 * Creates an Brianfy instance
 * @param {Object} SYSTEM_DATA
 */
const Brianfy = async SYSTEM_DATA => {
  const tokens = SYSTEM_DATA.tokens.filter(
    token => token.provider === 'spotify'
  )

  if (tokens.length) {
    const access = tokens.find(token => token.type === 'access')
    const refresh = tokens.find(token => token.type === 'refresh')

    return loadBrianfy(access, refresh, true)
  }

  return authorize()
}

export default Brianfy

export { authorize, findPlaylists, startPlaylist, smartSearch, setVoiceVolume }
