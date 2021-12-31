const timekit = require('timekit-sdk')

const sdk = timekit.newInstance()

sdk.configure({
  appKey: process.env.TIMEKIT_APP_KEY,
  availability: {
    resources: [process.env.TIMEKIT_RESOURCE_ID],
    mode: 'roundrobin_random',
    length: process.env.TIMEKIT_BOOKING_LENGTH || '30 minutes',
    from: process.env.TIMEKIT_BOOKING_FROM || '1 hour',
    to: process.env.TIMEKIT_BOOKING_TO || '3 months',
    buffer: '0 minutes',
    ignore_all_day_events: false,
    output_timezone: 'America/Toronto',
    constraints: [
      { allow_day_and_time: { day: 'monday', start: 8, end: 22 } },
      { allow_day_and_time: { day: 'tuesday', start: 8, end: 22 } },
      { allow_day_and_time: { day: 'wednesday', start: 8, end: 22 } },
      { allow_day_and_time: { day: 'thursday', start: 8, end: 22 } },
      { allow_day_and_time: { day: 'friday', start: 8, end: 22 } },
      { allow_day_and_time: { day: 'saturday', start: 8, end: 22 } },
      { allow_day_and_time: { day: 'sunday', start: 8, end: 22 } },
    ],
  },
})

module.exports = sdk
