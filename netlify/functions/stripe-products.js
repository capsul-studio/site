const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const products = require('./data/stripe-products-ids.json')
const { responseHeaders, isProduction, omit } = require('./helpers/shared.js')

const spaceProduct = isProduction ? products.live.space : products.test.space
const cleaningProduct = isProduction ? products.live.cleaning : products.test.cleaning

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

  // Returns a list of procuts with its prices
  if (event.httpMethod === 'GET') {
    const prices = await stripe.prices.list({
      expand: ['data.product'],
    })

    const parsedProducts = prices.data
      .map((price) => {
        return {
          ...price.product,
          price: omit(price, ['product']),
        }
      })

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({
        cleaningProduct: parsedProducts.find((product) => product.id === cleaningProduct.id),
        spaceProduct: parsedProducts.find((product) => product.id === spaceProduct.id),
      }),
    }
  }
}
