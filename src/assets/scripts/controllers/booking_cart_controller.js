import { Controller } from '@hotwired/stimulus'
import { toCurrency, toggleBookingStep, toReadableDate, toReadableHour } from '../helpers/shared'

export default class extends Controller {
  static targets = [
    "bookingTime",
    "cleaningProductPrice",
    "cleaningProductTitle",
    "cleaningProductDescription",
    "spaceProductPrice",
    "spaceProductQuantity",
    "spaceProductTitle",
    "spaceProductDescription",
    "estimatedTotal",
  ]

  static values = {
    cleaningProduct: Object,
    spaceProduct: Object,
    spaceProductQuantity: {
      type: Number,
      default: 2,
    },
    bookingStartTime: String,
    bookingEndTime: String
  }

  connect() {
    this.spaceProduct = null
    this.spaceProductQuantity = 2
    this.cleaningProduct = null
  }

  update(event) {
    const data = event.detail

    if (!event.detail) return

    if (data.cleaningProduct) this.cleaningProductValue = data.cleaningProduct
    if (data.spaceProduct) this.spaceProductValue = data.spaceProduct
    if (data.quantity) this.spaceProductQuantityValue = data.quantity
    if (data.startTime) this.bookingStartTimeValue = data.startTime
    if (data.endTime) this.bookingEndTimeValue = data.endTime

    if (!this.spaceProductValue || !this.cleaningProductValue) return;

    this.renderCleaningProduct(this.cleaningProductValue)
    this.renderSpaceProduct(this.spaceProductValue, this.spaceProductQuantityValue)
    if (this.bookingStartTimeValue && this.bookingEndTimeValue) this.renderBookingTime(this.bookingStartTimeValue, this.bookingEndTimeValue)

    const estimatedTotal = this.calculateEstimatedTotal(this.cleaningProductValue, this.spaceProductValue, this.spaceProductQuantityValue)
    this.renderEstimatedTotal(estimatedTotal)
  }

  clearTime() {
    this.bookingStartTimeValue = null
    this.bookingEndTimeValue = null
    toggleBookingStep(this.element, false)
  }

  calculateEstimatedTotal(cleaningProduct, spaceProduct, spaceProductQuantity = 2) {
    return cleaningProduct.price.unit_amount + (spaceProductQuantity * spaceProduct.price.unit_amount)
  }

  renderEstimatedTotal(amount, currency) {
    if (this.hasEstimatedTotalTarget) this.estimatedTotalTarget.innerText = toCurrency(amount, currency)
  }

  renderBookingTime(start, end) {
    if (!this.hasBookingTimeTarget) return

    this.bookingTimeTarget.innerText = `${toReadableDate(start)} from  ${toReadableHour(start)} to ${toReadableHour(end)}`
  }

  renderCleaningProduct(product) {
    if (this.hasCleaningProductPriceTarget) this.renderCleaningProductPrice(product.price.unit_amount, product.price.currency)
    if (this.hasCleaningProductTitleTarget) this.renderCleaningProductTitle(product.name)
    if (this.hasCleaningProductDescriptionTarget) this.renderCleaningProductDescription(product.description)
  }

  renderCleaningProductPrice(amount, currency) {
    this.cleaningProductPriceTarget.innerText = toCurrency(amount, currency)
  }

  renderCleaningProductTitle(title) {
    this.cleaningProductTitleTarget.innerText = title
  }

  renderCleaningProductDescription(description) {
    this.cleaningProductDescriptionTarget.innerText = description
  }

  renderSpaceProduct(product, quantity) {
    if (this.hasSpaceProductPriceTarget) this.renderSpaceProductPrice(product.price.unit_amount * quantity, product.price.currency)
    if (this.hasSpaceProductTitleTarget) this.renderSpaceProductTitle(product.name)
    if (this.hasSpaceProductDescriptionTarget) this.renderSpaceProductDescription(product.description)
    if (this.hasSpaceProductQuantityTarget && quantity) this.renderSpaceProductQuantity(quantity)
  }

  renderSpaceProductPrice(amount, currency) {
    this.spaceProductPriceTarget.innerText = toCurrency(amount, currency)
  }

  renderSpaceProductTitle(title) {
    this.spaceProductTitleTarget.innerText = title
  }

  renderSpaceProductDescription(description) {
    this.spaceProductDescriptionTarget.innerText = description
  }

  renderSpaceProductQuantity(quantity) {
    this.spaceProductQuantityTarget.innerText = `(${quantity/2} hour${quantity/2 > 1 ? 's' : ''})`
  }
}
