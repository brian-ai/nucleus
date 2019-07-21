/**
 * RabbitMQ Service Handler
 * @memberof brian-ai
 */
import amqp from 'amqplib/callback_api'
import logger from 'hoopa-logger'
import { RABBIT_URL, RABBIT_PORT } from '@brian-ai/core/config'

/**
 * Subsribe to related topic rabbitmq channel
 * @param {String} topic
 * @param {Function} actionCallback
 */
const subscribeToChannel = (topic, actionCallback) => {
  logger.info(`Connecting to ${topic} topic...`)

  return amqp.connect(
    `amqp://${RABBIT_URL}:${RABBIT_PORT}`,
    (err, connection) => {
      if (err) {
        logger.error(`RabbitMQ | Connection error: ${err}`)
      }

      logger.info(`${topic} connected successfully!`)

      logger.info(`Estabilishing channel with ${topic}...`)
      connection.createChannel((error, channel) => {
        if (error) {
          logger.error(`RabbitMQ | Error creating channel: ${error}`)
        }

        logger.info(`Suscribed to ${topic}`)
        channel.assertExchange(topic, 'fanout', { durable: false })
        channel.assertQueue('', { exclusive: true }, (er, q) => {
          if (er) {
            logger.error(`RabbitMQ | Error assertQueue: ${error}`)
          }

          channel.bindQueue(q.queue, topic, '')

          channel.consume(
            q.queue,
            msg => {
              logger.info(
                `${topic} incoming message: ${msg.content.toString()}`
              )

              actionCallback(msg)
            },
            { noAck: true }
          )
        })
      })
    }
  )
}

/**
 * Send a message to a topic channel
 * @param {String} topic
 * @param {String} message
 */
const sendMessage = (topic, message) => {
  logger.info(`Connecting to rabbitmq ${topic} topic...`)

  return amqp.connect(
    `amqp://${RABBIT_URL}:${RABBIT_PORT}`,
    (err, connection) => {
      if (err) {
        return logger.error(`RabbitMQ | Connection error: ${err}`)
      }
      logger.info(`${topic} connected successfully!`)

      const content = Buffer.from(message)

      logger.info(`Connecting to ${topic}...`)

      return connection.createChannel((error, channel) => {
        if (error) {
          return logger.error(`RabbitMQ | Error connecting: ${error}`)
        }

        logger.info(`${topic} - conected!`)
        channel.assertExchange(topic, 'fanout', { durable: false })
        channel.publish(topic, '', content)

        return logger.info(`${topic} --message sent! --data: ${message}`)
      })
    }
  )
}

export default {
  subscribeToChannel,
  sendMessage
}
