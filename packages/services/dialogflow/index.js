/**
 * DialogFlow Service Handler
 * @memberof brian-ai
 */
import dialogflow from 'dialogflow'
import uuid from 'uuid'

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {String} text The sentence to be analyzed
 * @param {String} projectId The project to be used
 */
const processSentence = async (text, projectId = 'brian-b9b6e') => {
  const sessionId = uuid.v4()
  const sessionClient = new dialogflow.SessionsClient()
  const sessionPath = sessionClient.sessionPath(projectId, sessionId)

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: 'en-US'
      }
    }
  }

  const responses = await sessionClient.detectIntent(request)
  const { queryText, fulfillmentText, intent } = responses[0].queryResult

  return {
    queryText,
    fulfillmentText,
    intent
  }
}

const Agent = {
  processSentence
}

export default Agent
