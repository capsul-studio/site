const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { responseHeaders } = require('./helpers/shared.js')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'OPTIONS') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ message: 'Successful preflight call.' }),
    }
  }

  // Fetch existing customer or create a new one
  if (event.httpMethod === 'POST') {
    const { name, email } = JSON.parse(event.body)
    if (!email || !name) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ message: 'Body is missing email and/or name values.' }),
      }
    }

    const customerSearchByEmail = await stripe.customers.list({ email: email, limit: 1 })

    let customer = customerSearchByEmail.data[0]
    if (!customer) customer = await stripe.customers.create({ email, name })

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(customer),
    }
  }
}
