import GoogleConfig from '@brian-ai/core/config/secrets/client-secret.json'

// Sample CalendarAPI settings
const serviceAcctId = GoogleConfig.client_email
const timezone = 'UTC-03:00';
const calendarId = {
	'primary': 'alcantaracaiolucas@gmail.com',
};
const key =  GoogleConfig.private_key;

export {
    serviceAcctId,
    timezone,
    calendarId,
    key
}