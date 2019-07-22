/**
 * The Speaker
 * @memberof brian-ai/brain
 */

import AWS from 'aws-sdk'
import Speaker from 'speaker'
// Utils
import logger from 'hoopa-logger'

const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-east-1'
})

/**
 * Create an PCM Sentence
 * @param {String} sentence
 * @returns {Object} PCMText
 */
const createSentence = sentence => {
  const Text = `
		<speak>
			<amazon:effect vocal-tract-length="+5%">
				<amazon:auto-breaths>
					${sentence}
				</amazon:auto-breaths>
			</amazon:effect>
		</speak>
	`

  return {
    Text,
    OutputFormat: 'pcm',
    TextType: 'ssml',
    VoiceId: 'Brian'
  }
}

/**
 * Creates an speaker instance
 * @param {Object} callback
 */
const createSpeaker = callback => {
  const speaker = new Speaker({
    channels: 1,
    bitDepth: 16,
    sampleRate: 17650
  })

  speaker.on('open', () => {
    logger.info('Speaker opened')
  })

  speaker.on('close', () => {
    logger.info('Speaker closed')
    callback()
  })

  return speaker
}

/**
 * Outputs an phrase through brian's voice
 * @param {String} phrase
 */
const speak = phrase =>
  new Promise((resolve, reject) => {
    Polly.synthesizeSpeech(createSentence(phrase), (err, res) => {
      if (err || !(res.AudioStream instanceof Buffer)) {
        reject(err || 'Not is a buffer')
      }

      const speaker = createSpeaker(resolve)

      try {
        speaker.write(Buffer.from(res.AudioStream), () => {
          setTimeout(() => speaker.close(), 800)
        })
      } catch (error) {
        return logger.error(`Error opening speaker: ${error}`)
      }
    })
  })

export default speak
