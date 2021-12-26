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

export {
  getFutureDate,
  getMonths,
}
