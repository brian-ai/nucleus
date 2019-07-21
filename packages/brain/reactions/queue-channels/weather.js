/**
 * Weather Handler
 * @memberof queue-channels
 */

import logger from 'hoopa-logger'

const weatherHandler = ({ content }) =>
  logger.info(`Weather control: received ${content}`)

export default weatherHandler
