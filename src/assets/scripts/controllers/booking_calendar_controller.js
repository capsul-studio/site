import { Controller } from '@hotwired/stimulus'
import Calendar from 'calendar-js'
import { toggleBookingStep } from '../helpers/shared'

export default class extends Controller {
  update (newState) {
    try {
      if (!newState.year || !newState.month) {
        this.clear()
        return
      }

      let calendarHTML = ''
      const calendar = Calendar().of(newState.year, newState.month - 1)

      calendarHTML += this.generateCalendarHeaderHTML(calendar)
      calendarHTML += this.generateCalendarWeekdaysHTML(calendar)
      calendarHTML += this.generateCalendarDaysHTML(calendar, newState)

      this.element.innerHTML = calendarHTML
      toggleBookingStep(this.element, true)
    } catch (error) {
      console.error('Could not render booking calendar component.', error)
    }
  }

  clear () {
    this.element.innerHTML = ''
    toggleBookingStep(this.element, false)
  }

  generateCalendarHeaderHTML (calendar) {
    return `
      <div class="w-full h-12 flex items-center justify-center border-2 border-black border-b-0 rounded-t-lg">
        ${calendar.month} ${calendar.year}
      </div>
    `
  }

  generateCalendarWeekdaysHTML (calendar) {
    const calendarWeekdaysHTML = calendar.weekdays.reduce((html, weekday) => {
      return `
        ${html}
        <div class="w-auto h-12 flex items-center justify-center text-gray-800">
          ${weekday.charAt(0)}
        </div>
      `
    }, '')

    return `
      <div class="grid grid-cols-7 gap-2 border-2 border-black">
        ${calendarWeekdaysHTML}
      </div>
    `
  }

  generateCalendarDaysHTML (calendar, state) {
    let calendarDaysHTML = ''

    calendar.calendar.forEach((row) => {
      calendarDaysHTML += '<div class="grid grid-cols-7 gap-2">'

      row.forEach((day) => {
        if (day > 0) {
          const dayDate = `${state.year}-${String(state.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

          calendarDaysHTML += `
            <div class="w-auto h-12 flex items-center justify-center">
              <button
                class="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400 ${state.date === dayDate ? 'bg-black hover:bg-black text-white' : 'hover:bg-true-gray-300'}"
                data-action="booking#selectDay"
                data-day="${dayDate}"
                ${this.dayHasAvailability(dayDate, state.availability) ? '' : 'disabled'}
              >
                ${day}
              </button>
            </div>
          `
        } else {
          calendarDaysHTML += '<div class="w-12 h-12"></div>'
        }
      })

      calendarDaysHTML += '</div>'
    })

    return `
      <div class="py-2 rounded-b-lg border-2 border-black border-t-0">
        ${calendarDaysHTML}
      </div>
    `
  }

  dayHasAvailability (date, availability) {
    const yearAndMonth = date.substring(0, 7)
    const day = date.substring(8, 10)

    if (availability[yearAndMonth] && availability[yearAndMonth][day] && availability[yearAndMonth][day].length) {
      return true
    }

    return false
  }
}
