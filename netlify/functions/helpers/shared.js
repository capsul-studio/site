const isProduction = process.env.CONTEXT === 'production'

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
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

const toReadableHour = (dateString) => {
  return new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: 'numeric', hour12: false, timeZone: 'America/Toronto' }).format(new Date(dateString))
}

const toReadableDate = (dateString) => {
  return new Intl.DateTimeFormat('en-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Toronto' }).format(new Date(dateString))
}

module.exports = {
  responseHeaders,
  isProduction,
  toReadableDate,
  toReadableHour,
  omit,
}
