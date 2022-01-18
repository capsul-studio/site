const { responseHeaders } = require('../helpers/shared.js')
const timekit = require('./timekit')

function isValidPayment (stripeEvent) {
  return (stripeEvent.data.object.status === 'complete' && stripeEvent.data.object.payment_status === 'paid')
}

function getStripePaymentUrl (stripeEvent) {
  return `https://dashboard.stripe.com${stripeEvent.data.object.livemode ? '/payments' : '/test/payments'}/${stripeEvent.data.object.payment_intent}`
}

async function handleCheckoutSessionCompleted (stripeEvent) {
  const id = stripeEvent.data.object.metadata.booking_id

  try {
    const response = await timekit.updateBooking({
      id,
      action: 'pay',
      pay: {
        payment_id: stripeEvent.data.object.payment_intent,
      },
      customer: {
        phone: stripeEvent.data.object.customer.phone,
      },
      meta: {
        stripe_url: getStripePaymentUrl(stripeEvent),
        stripe_id: stripeEvent.data.object.payment_intent,
      },
    })

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(response.data),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify(error.data),
    }
  }
}

async function handleCheckoutSessionCancelled (stripeEvent) {
  const id = stripeEvent.data.object.metadata.booking_id

  try {
    const response = await timekit.updateBooking({
      id,
      action: 'cancel',
    })

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(response.data),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify(error.data),
    }
  }
}

module.exports = {
  isValidPayment,
  getStripePaymentUrl,
  handleCheckoutSessionCompleted,
  handleCheckoutSessionCancelled,
}
