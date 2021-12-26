const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const products = require('./data/stripe-products-ids.json')
const { responseHeaders, isProduction } = require('./helpers/shared.js')

const spaceProduct = isProduction ? products.live.space : products.test.space
const cleaningProduct = isProduction ? products.live.cleaning : products.test.cleaning

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

  if (event.httpMethod === 'POST') {
    const quantity = event.queryStringParameters.qty || 1
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: spaceProduct.price,
          quantity,
        },
        {
          price: cleaningProduct.price,
          quantity: 1,
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      mode: 'payment',
      success_url: `${process.env.URL}/success.html`,
      cancel_url: `${process.env.URL}/cancel.html`,
    })

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({
        session,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      }),
    }
  }
}
