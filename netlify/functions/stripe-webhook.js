const stripe = require('stripe')
const { responseHeaders } = require('./helpers/shared.js')
const { handleCheckoutSessionCompleted, handleCheckoutSessionCancelled } = require('./lib/stripe.js')

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = 'whsec_Er4c1i64GAvdhHOc2d6kn16kwZQiRqOB'

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature']

  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret)
  } catch (err) {
    return { statusCode: 400, headers: responseHeaders, body: JSON.stringify(`Webhook Error: ${err.message}`) }
  }

  let statusCode = 200
  let body

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      return handleCheckoutSessionCompleted(stripeEvent)
    case 'checkout.session.expired':
      return handleCheckoutSessionCancelled(stripeEvent)
    default:
      statusCode = 422
      body = `Unhandled event type ${stripeEvent.type}`
  }

  return {
    statusCode,
    headers: responseHeaders,
    body: JSON.stringify(body),
  }
}
