/**
 * Knowledge Handler
 * @memberof brian-ai/brain
 */

import { createLink, data } from 'rethinkly'
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

  return createLink(dbConfig)
}

/**
 * Base knowledge representation
 */
const baseKnowledge = {
  feelings,
  natural: NaturalElements,
  getInstance,
  data
}

export default baseKnowledge
