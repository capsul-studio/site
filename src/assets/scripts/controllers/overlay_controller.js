import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['overlay'];

  connect() {
    let params = new URLSearchParams(document.location.search)
    let booking = params.has("booking")
    if (booking) this.open()
  }

  open() {
    this.overlayTarget.classList.add('is-visible')
  }

  close() {
    this.overlayTarget.classList.remove('is-visible')
  }
}
