const timekit = require('./lib/timekit')
const { responseHeaders, toReadableHour, toReadableDate } = require('./helpers/shared')

exports.handler = async (event) => {
  if (!['POST', 'GET', 'OPTIONS'].includes(event.httpMethod)) {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ message: 'Successful preflight call.' }),
    }
  }

  // Get specific booking
  if (event.httpMethod === 'GET') {
    const bookingId = event.queryStringParameters.id

    if (bookingId) {
      const booking = await timekit.getBooking({ id: bookingId })

      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify(booking),
      }
    }

    return {
      statuscode: 400,
      headers: responseHeaders,
      body: JSON.stringify({ message: 'Request is missing [id] query param.' }),
    }
  }

  // Create a new booking
  if (event.httpMethod === 'POST') {
    const { start, end, customer } = JSON.parse(event.body)

    if (!start || !end || !customer) {
      return {
        statuscode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ message: 'Body is missing [start] or [end] or [customer] attributes.' }),
      }
    }

    const booking = await timekit.createBooking({
      resource_id: process.env.TIMEKIT_RESOURCE_ID,
      graph: 'instant_payment',
      start,
      end,
      what: process.env.TIMEKIT_BOOKING_WHAT,
      where: process.env.TIMEKIT_BOOKING_WHERE,
      description: `${toReadableDate(start)} from  ${toReadableHour(start)} to ${toReadableHour(end)}`,
      participants: [customer.email],
      timeout: {
        time: 60,
        unit: 'min',
      },
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone ? customer.phone : 'Not available',
        timezone: 'America/Toronto',
      },
    })

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(booking.data),
    }
  }
}
