import { Controller } from "@hotwired/stimulus"
import { toReadableHour, toReadableDate, toggleBookingStep } from "../helpers/shared"

export default class extends Controller {
  static targets = ["name", "email", "submitButton"]

  connect() {
    this.buttonInitialHtml = this.submitButtonTarget.innerHTML
  }

  update(event) {
    const data = event.detail

    if (data.startTime) this.bookingStartTime = data.startTime
    if (data.endTime) this.bookingEndTime = data.endTime
    if (data.quantity) this.bookingQuantity = data.quantity

    if (this.bookingStartTime && this.bookingEndTime && this.bookingQuantity) {
      this.enableForm()
      toggleBookingStep(this.element, true)
      return
    }

    this.disableForm()
    toggleBookingStep(this.element, false)
  }

  async submit(event) {
    event.preventDefault()

    this.disableForm()
    const customer = await this.createStripeCustomer(this.emailTarget.value, this.nameTarget.value)
    const booking = await this.createTimekitBooking(this.bookingStartTime, this.bookingEndTime, {name: customer.name, email: customer.email, phone: customer.phone})
    const sessionResponse = await this.createStripeSession(booking.id, customer.id, this.bookingQuantity, this.bookingStartTime, this.bookingEndTime)

    if (sessionResponse.session.url) {
      this.redirectToStripe(sessionResponse.session)
      return
    }

    this.enableForm()
  }

  disableForm(message) {
    this.submitButtonTarget.disabled = true
    if (message) this.submitButtonTarget.innerText = message
  }

  enableForm(message) {
    this.submitButtonTarget.disabled = false
    if (message) this.submitButtonTarget.innerHTML = this.buttonInitialHtml
  }

  createTimekitBooking(start, end, customer) {
    return fetch('.netlify/functions/timekit-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer, start, end }),
    })
    .then(response => response.json())
    .then(booking => {
      return booking
    })
    .catch((error) => {
      console.error('Error:', error);
      return false
    });
  }

  createStripeCustomer(email, name) {
    return fetch('.netlify/functions/stripe-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    })
    .then(response => response.json())
    .then(data => {
      return data
    })
    .catch((error) => {
      console.error('Error:', error);
      return false
    });
  }

  createStripeSession(bookingId, customer, quantity, startTime, endTime) {
    return fetch('.netlify/functions/stripe-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({bookingId, customer, quantity, startTime, endTime }),
    })
    .then(response => response.json())
    .then(session => {
      return session
    })
    .catch((error) => {
      console.error('Error:', error);
      return false
    });
  }

  redirectToStripe(session) {
    window.location.href = session.url
  }
}
