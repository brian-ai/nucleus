/**
 * Knowledge Handler
 * @memberof brian-ai/brain
 */

import rethinkly, { retrieveData } from 'rethinkly'
// Seedling
import { feelings } from './feelings'
import NaturalElements from './natural-sentences'
// Configs
import { RETHINKDB_URL, RETHINKDB_PORT, DB_NAME } from '@brian-ai/core/config'

/**
 * Retrieve an instance
 */
const getInstance = () => {
  const dbConfig = {
    host: RETHINKDB_URL,
    port: RETHINKDB_PORT,
    db: DB_NAME
  }

  return rethinkly(dbConfig)
}

/**
 * Base knowledge representation
 */
const baseKnowledge = {
  feelings,
  natural: NaturalElements,
  instance: { getInstance, retrieveData }
}

export default baseKnowledge
