import rethinkly, { retrieveData } from 'rethinkly'
// Configs
import { RETHINKDB_URL, RETHINKDB_PORT, DB_NAME } from '@brian-ai/core/config'
import { feelings } from './feelings'
import NaturalElements from './natural-sentences'

const getInstance = () => {
  const dbConfig = {
    host: RETHINKDB_URL,
    port: RETHINKDB_PORT,
    db: DB_NAME
  }

  return rethinkly(dbConfig)
}

const baseKnowledge = {
  feelings,
  natural: NaturalElements,
  instance: { getInstance, retrieveData }
}

export default baseKnowledge
