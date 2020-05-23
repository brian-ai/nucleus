import {
    serviceAcctId,
    timezone,
    calendarId,
    key
} from './config'
import GoogleCalendarAPI from 'node-google-calendar';

const Calendar = new GoogleCalendarAPI({
    serviceAcctId,
    timezone,
    calendarId,
    key
})

export const getEvents = async (timeRange = {}) => {
    let timeMin = timeRange.timeMin
    let timeMax = timeRange.max
    
    if (!timeRange.min || !timeRange.max) {
        const today = new Date();
        timeMin = today.toISOString();
        timeMax = new Date(today.setHours(today.getHours() + 24)).toISOString()
    }

    const params = {
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime'
    };
        
    const response = await Calendar.Events.list(calendarId.primary, params)
        
    return response
}