const getMonths = (startDate, endDate) => {
  const start = startDate.split('-')
  const end = endDate.split('-')
  const startYear = parseInt(start[0])
  const endYear = parseInt(end[0])
  const dates = []

  for (let i = startYear; i <= endYear; i++) {
    const endMonth = i !== endYear ? 11 : parseInt(end[1]) - 1
    const startMon = i === startYear ? parseInt(start[1]) - 1 : 0
    for (let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
      const month = j + 1
      const displayMonth = month < 10 ? '0' + month : month
      dates.push([i, displayMonth].join('-'))
    }
  }
  return dates
}

const getFutureDate = (days) => {
  return new Date(new Date().setDate(new Date().getDate() + days)).toISOString().substring(0, 10)
}

const toCurrency = (amount, currency) => {
  const c = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency || 'CAD',
    minimumFractionDigits: 2,
  })

  return c.format(amount / 100)
}

const toReadableHour = (dateString) => {
  return new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: 'numeric', hour12: false }).format(new Date(dateString))
}

const toReadableDate = (dateString) => {
  return new Intl.DateTimeFormat('en-CA', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString))
}

const toggleBookingStep = (element, newStatus) => {
  const step = element.closest('.booking-step')
  if (step) step.classList.toggle('booking-step--active', !!newStatus)
}

export {
  getFutureDate,
  getMonths,
  toCurrency,
  toReadableHour,
  toReadableDate,
  toggleBookingStep,
}
