import { Controller } from "@hotwired/stimulus"
import { toReadableHour, toReadableDate } from "../helpers/shared"

export default class extends Controller {
  static targets = ["name", "email", "submitButton"]

  connect() {
    this.buttonInitialHtml = this.submitButtonTarget.innerHTML
  }

  update(event) {
    const data = event.detail

    if (data.startTime) this.bookingStartTime = `${toReadableDate(data.startTime)} - ${toReadableHour(data.startTime)}`
    if (data.endTime) this.bookingEndTime = `${toReadableDate(data.endTime)} - ${toReadableHour(data.endTime)}`
    if (data.quantity) this.bookingQuantity = data.quantity

    if (this.bookingStartTime && this.bookingEndTime && this.bookingQuantity) this.enableForm()
  }

  async submit(event) {
    event.preventDefault()

    this.disableForm()
    const customer = await this.fetchCustomer(this.emailTarget.value, this.nameTarget.value)
    const sessionResponse = await this.fetchSession(customer.id, this.bookingQuantity, this.bookingStartTime, this.bookingEndTime)

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

  fetchCustomer(email, name) {
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

  fetchSession(customer, quantity, startTime, endTime) {
    return fetch('.netlify/functions/stripe-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer, quantity, startTime, endTime }),
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
