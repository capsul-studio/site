import { Controller } from "@hotwired/stimulus"
import { getMonths, getFutureDate } from '../helpers/shared'


export default class extends Controller {
  static values = {
    state: {
      type: Object,
      default: {
        year: null,
        month: null,
        day: null,
        monthsAvailableToBook: '',
      }
    },
    limitDate: String,
  }

  connect() {
    const calendarElement = document.querySelector('[data-controller="booking-calendar"]');
    const monthsElement = document.querySelector('[data-controller="booking-months"]');

    if (!calendarElement || !monthsElement) console.error('Could not initialize booking component - missing necessary children elements')

    Promise.resolve().then(() => {
      this.bookingCalendarController = this.application.getControllerForElementAndIdentifier(calendarElement, 'booking-calendar')
      this.bookingMonthsController = this.application.getControllerForElementAndIdentifier(monthsElement, 'booking-months')
      this.limitDateValue = getFutureDate(90);
    });
  }

  limitDateValueChanged(value) {
    if (!this.bookingMonthsController) return;

    this.stateValue.monthsAvailableToBook = getMonths(getFutureDate(0), value)
    this.bookingMonthsController.update(this.stateValue)
  }

  selectMonth(event) {
    this.stateValue.year = Number(event.currentTarget.dataset.year)
    this.stateValue.month = Number(event.currentTarget.dataset.month)

    this.bookingCalendarController.update(this.stateValue)
    this.bookingMonthsController.update(this.stateValue)
  }

  selectDay(event) {
    console.log('select day', event)
  }
}
