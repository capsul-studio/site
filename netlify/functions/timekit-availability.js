const timekit = require('./lib/timekit')
const { responseHeaders } = require('./helpers/shared')

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'OPTIONS') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ message: 'Successful preflight call.' }),
    }
  }

  if (event.httpMethod === 'GET') {
    const availabilityResponse = await timekit.fetchAvailability(timekit.getConfig().availability)

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(availabilityResponse.data),
    }
  }
}
