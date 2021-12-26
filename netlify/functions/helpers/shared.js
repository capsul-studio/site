const isProduction = process.env.CONTEXT === 'production'

const responseHeaders = {
  'Access-Control-Allow-Origin': isProduction ? 'https://capsul.studio' : '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

function omit (obj, keys) {
  const target = {}
  for (const i in obj) {
    if (keys.indexOf(i) >= 0) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }
  return target
}

module.exports = {
  responseHeaders,
  isProduction,
  omit,
}
