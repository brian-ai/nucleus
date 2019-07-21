/**
 * Devices Handler
 * @memberof queue-channels
 */

import logger from 'hoopa-logger'

const devicesHandler = async ({ player, instance }) => {
  logger.info('Devices handler started, checking current devices family...')

  try {
    const {
      body: { devices }
    } = await player.getAvailableDevices(instance)

    return devices
  } catch (error) {
    return logger.error('Devices handler error')
  }
}

export default devicesHandler
