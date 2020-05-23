/**
 * The Brain
 * @memberof brian-ai
 */
// Stimulus reactions
import { musicHandler, conversationHandler } from './reactions/queue-channels'
// Knowledge
import Memory from './memory'
// Routines Controller
import Routines from './routines'
// Services
import { RabbitMQ, player, NLP } from '@brian-ai/services'
import HotwordDetector from './communication/listening'
// Utils
import logger from 'hoopa-logger'

const Subscriber = (SYSTEM_DATA, LanguageProcessor, Brianfy) => {
  const coreProps = {
    player,
    instance: Brianfy,
    core: {
      SYSTEM_DATA
    }
  }

  const channels = [
    {
      channel: 'music_service',
      callback: msg => musicHandler(coreProps, msg)
    },
    {
      channel: 'conversation_service',
      callback: msg => conversationHandler(msg, LanguageProcessor, coreProps)
    }
  ]

  return channels.map(({ channel, callback }) =>
    RabbitMQ.subscribeToChannel(channel, callback)
  )
}

export const init = async () => {
  const { instance: playerInstance } = player
  const SYSTEM_DATA = await Memory.getSystemMemory()
  const Brianfy = await playerInstance.create(SYSTEM_DATA)
  const { LanguageProcessor, Bayes } = NLP

  NLP.trainModel(null, Bayes, LanguageProcessor)
  Subscriber(SYSTEM_DATA, LanguageProcessor, Brianfy)
  Routines(player, Brianfy)

  // TODO: Fix hotword detector sensibiltiy
  // HotwordDetector()
}

export default init
