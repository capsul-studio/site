import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['overlay'];

  initialize() {

  }

  connect() {
    this.open();
  }

  open() {
    this.overlayTarget.classList.add('is-visible');
  }

  close() {
    this.overlayTarget.classList.remove('is-visible');
  }
}
