/**
 * Memory Handler
 * @memberof brian-ai/brain
 */

// Utils
import { safeEmpty } from '@brian-ai/core/utils'
import { data } from 'rethinkly'
import logger from 'hoopa-logger'
// Areas
import baseKnowledge from '../knowledge'

/**
 * Get a memory piece
 * @param {String} table
 * @param {String} label
 */
const getMemoryShred = async (table, label) => {
  const { getInstance } = baseKnowledge
  const dbInstance = await getInstance()

  const result = data.get(dbInstance, table)

  logger.info(`${label} loaded`)

  return result
}

/**
 * The Memory
 */
const Memory = {
  getSystemMemory: async () => {
    const config =
      (await getMemoryShred('config', 'Config')) || safeEmpty('config', {})
    const roles =
      (await getMemoryShred('roles', 'Roles')) || safeEmpty('roles', [])
    const people =
      (await getMemoryShred('people', 'People')) || safeEmpty('people', [])
    const providers =
      (await getMemoryShred('providers', 'Providers')) ||
      safeEmpty('providers', [])
    const tokens =
      (await getMemoryShred('tokens', 'Tokens')) || safeEmpty('tokens', [])

    logger.info('System main memory loaded')

    return { config, roles, people, providers, tokens }
  }
}

export default Memory
