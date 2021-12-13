import { Controller } from "@hotwired/stimulus"
import Calendar from "calendar-js";

export default class extends Controller {
  update(newState) {
    let calendarHTML = ''
    const calendar = Calendar().of(newState.year, newState.month)

    calendarHTML += this.generateCalendarHeaderHTML(calendar)
    calendarHTML += this.generateCalendarWeekdaysHTML(calendar)
    calendarHTML += this.generateCalendarDaysHTML(calendar)

    this.element.innerHTML = calendarHTML
  }

  generateCalendarHeaderHTML(calendar) {
    return `
      <div class="w-full h-12 flex items-center justify-center">
        ${calendar.month} ${calendar.year}
      </div>
    `
  }

  generateCalendarWeekdaysHTML(calendar) {
    const calendarWeekdaysHTML = calendar.weekdays.reduce((html, weekday) => {
      return `
        ${html}
        <div class="w-12 h-12 flex items-center justify-center text-gray-600">
          ${weekday.charAt(0)}
        </div>
      `
    }, '')

    return `
      <div class="grid grid-cols-7 gap-2">
        ${calendarWeekdaysHTML}
      </div>
    `
  }

  generateCalendarDaysHTML(calendar) {
    let calendarDaysHTML = ''

    calendar.calendar.forEach(row => {
      calendarDaysHTML += '<div class="grid grid-cols-7 gap-2">'

      row.forEach(day => {
        if (day > 0) {
          calendarDaysHTML += `
            <div class="w-12 h-12 flex items-center justify-center">
              <button class="w-10 h-10 rounded-full cursor-pointer hover:bg-black hover:text-white" data-action="booking#selectDay">
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

    return calendarDaysHTML;
  }
}
