import { Controller } from "@hotwired/stimulus"

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class extends Controller {
  static targets = ["button"]

  connect() {
    this.state = {}
  }

  renderMonthButtons(months) {
    this.element.innerHTML = months.reduce((html ,calendarMonth) => {
      const year = Number(calendarMonth.split('-')[0])
      const month = Number(calendarMonth.split('-')[1])
      return `
        ${html}
        <button
          data-booking-months-target="button"
          data-action="booking#selectMonth"
          data-year="${year}"
          data-month="${month}"
          class="p-2 border-2 border-black rounded hover:bg-black hover:text-white"
        >
          ${monthNames[month - 1]} ${year}
        </button>
      `
    }, '');
  }

  update(newState) {
    try {
      // Render button if new state
      if (newState.monthsAvailableToBook !== this.state.monthsAvailableToBook) {
        this.renderMonthButtons(newState.monthsAvailableToBook)
      }

      // Set active button
      this.buttonTargets.forEach(button => {
        const buttonYear = Number(button.dataset.year)
        const buttonMonth = Number(button.dataset.month)
        button.classList.toggle('bg-black', (buttonYear == newState.year && buttonMonth == newState.month))
        button.classList.toggle('text-white', (buttonYear == newState.year && buttonMonth == newState.month))
      })

      this.state = newState;
    }
    catch (error) {
      console.error('Could not render booking months component.', error)

    }
  }
}
