import logger from 'hoopa-logger'
import publicIp from 'public-ip'
import geoip from 'geoip-lite'
// Helpers
import getWeatherInformation from './weather'
import { mountEventsInfo } from './events'
import { getGreetingTime } from '@brian-ai/core/utils'
import { TIME_OPTIONS } from '@brian-ai/core/config'
// Capabilities
import Speak from '@brian-ai/brain/communication'

/**
 * startDay
 * @memberof routines
 * The start day routine should run as a scheduled service to
 * provide useful information as first interaction with Brian,
 */
const startDay = async () => {
  const currentIP = await publicIp.v4()
  const location = await geoip.lookup(currentIP)
  const weatherInformation = await getWeatherInformation(location.ll)
  const temperature = weatherInformation.getTemperature()
  const smartWeatherInfo = weatherInformation.getSmartInfo()
  const greetingObject = getGreetingTime()
  const now = new Date()
  const humanizedNow = now.toLocaleTimeString('en-US', { ...TIME_OPTIONS })
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' })
  const eventData = await mountEventsInfo()
  
  logger.info('Daily useful information loaded!')
  console.log({ city: location.city})

  return Speak(`
		<p>${greetingObject.sentence} sir!</p>
		<p>It's ${humanizedNow} and the weather in ${location.city} is
    ${Math.round(temperature)}°C with possiblity of ${smartWeatherInfo}</p>

    ${eventData}
		
    <p>Have a lovely ${weekday}!</p>
		<break time="200ms"/>
	`)
}

export default startDay
