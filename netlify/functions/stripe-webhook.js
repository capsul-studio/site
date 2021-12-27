const stripe = require('stripe')
const { responseHeaders } = require('./helpers/shared.js')

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = 'whsec_Er4c1i64GAvdhHOc2d6kn16kwZQiRqOB'

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature']

  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret)
  } catch (err) {
    return { statusCode: 400, headers: responseHeaders, body: `Webhook Error: ${err.message}` }
  }

  let statusCode = 200
  let body

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      console.log('Confirm booking', stripeEvent.metadata)
      break
    case 'checkout.session.expired':
      console.log('Cancel booking', stripeEvent.metadata)
      break
    default:
      statusCode = 422
      console.log(stripeEvent.type)
      body = `Unhandled event type ${stripeEvent.type}`
  }

  return {
    statusCode,
    headers: responseHeaders,
    body,
  }
}
