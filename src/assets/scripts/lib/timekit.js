import timekit from "timekit-sdk";

const sdk = timekit.newInstance();

sdk.configure({
  appKey: 'test_api_key_WL19KDVHNQI5zvHUpsH6rwR5BZFhz6fS',
  availability: {
    resources: ["f128a6e3-a16b-4fba-9f02-dfaaadf46f6d"],
    mode: 'roundrobin_random',
    length: '30 minutes',
    from: '1 hour',
    to: '3 months',
    buffer: '0 minutes',
    ignore_all_day_events: false,
    output_timezone: 'America/toronto',
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

export default sdk;

