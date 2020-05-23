// Services
import { getEvents } from '@brian-ai/services/google-calendar'
// Config
import { TIME_OPTIONS } from '@brian-ai/core/config'

export const mountEventsInfo = async () => {
    const events = await getEvents()
    const eventsCount = events.length
    const eventsInfo = [];
    

    if (eventsCount > 0) {
        eventsInfo.push(`<p>You have ${eventsCount} ${eventsCount === 1 ? 'event' : 'events'} in your calendar</p>`);
        events.map(({ summary, originalStartTime }) => {
            const eventTime = new Date(originalStartTime.dateTime).toLocaleTimeString('en-US', { ...TIME_OPTIONS })
            
            eventsInfo.push(`<p>${summary} at ${eventTime}</p>`)
        })

        return eventsInfo.join('\n')
    }

    return `<p>You have no events planned for today</p>`
}