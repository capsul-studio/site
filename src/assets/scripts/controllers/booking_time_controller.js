import { Controller } from "@hotwired/stimulus"
import { toReadableHour } from "../helpers/shared"

export default class extends Controller {
  static targets = ["timeslotLabel", "firstStepTip", "secondStepTip"]

  static values = {
    siblingTimeslots: Array,
    minimumTimeslotToBook: Number,
    startTimeslot: String,
    endTimeslot: String,
    hoverStartTimeslot: String,
    hoverEndTimeslot: String,
  }

  update(newState) {
    try {
      if (newState.date === this.currentDateValue) return
      if (!newState.date) { this.clear(); return }
      if (newState.date !== this.currentDateValue) this.clearTimeSelection()

      this.siblingTimeslotsValue = this.parseTimeslots(newState)
      this.minimumTimeslotToBookValue = newState.minimumTimeslotToBook
      this.render()

    } catch (error) {
      console.error('Could not render booking time component.', error)
    }
  }

  render() {
    this.element.innerHTML = htmlTimeslotsComponent(this.siblingTimeslotsValue, this.minimumTimeslotToBookValue)
  }

  broadcastSelection() {
    const broadcast = new CustomEvent("booking.time.changed", {
      detail: {
        startTime: this.timeslotLabelTargets.find(label => label.dataset.timeId === this.startTimeslotValue).dataset.timeStart,
        endTime: this.timeslotLabelTargets.find(label => label.dataset.timeId === this.endTimeslotValue).dataset.timeEnd,
        quantity: this.timeslotLabelTargets.filter(label => label.querySelector('input').checked === true).length
      }
    })
    window.dispatchEvent(broadcast)
  }

  // value change methods

  startTimeslotValueChanged() {
    Promise.resolve().then(() => {
      this.toggleFirstStepTip(!this.startTimeslotValue)
      this.toggleSecondStepTip(!!this.startTimeslotValue)
    })
  }

  // methods

  clear() {
    this.element.innerHTML = ''
  }

  clearTimeSelection(rerender) {
    this.startTimeslotValue = ''
    this.endTimeslotValue = ''
    if (rerender) this.render()

    window.dispatchEvent(new CustomEvent('booking.time.deleted'))
  }

  toggleFirstStepTip(visible) {
    if (this.hasFirstStepTipTarget) this.firstStepTipTarget.classList.toggle('hidden', !visible)
  }

  toggleSecondStepTip(visible) {
    if (this.hasSecondStepTipTarget) this.secondStepTipTarget.classList.toggle('hidden', !visible)
  }


  parseTimeslots(newState) {
    let dateMonthAndYear = newState.date.substring(0,7)
    let dateDay = newState.date.substring(8,10)

    const availableTimeslots = newState.availability[dateMonthAndYear][dateDay]
    const parsedTimeslots = []

    availableTimeslots.forEach((timeslot, index) => {
      const previousTimeslotEnd = index > 0 ? availableTimeslots[index-1].end : ''

      if (previousTimeslotEnd === timeslot.start) {
        parsedTimeslots[parsedTimeslots.length-1].push(timeslot)
        return;
      }

      parsedTimeslots.push([timeslot])
    });

    return parsedTimeslots
  }

  selectTimeslot(event) {
    event.preventDefault()
    const targetTimeslotId = event.currentTarget.dataset.timeId

    const {startTime, endTime} = this.calculateStartAndEndTimeslots(targetTimeslotId, this.startTimeslotValue, this.endTimeslotValue)
    this.startTimeslotValue = startTime
    this.endTimeslotValue = endTime

    this.disableInvalidSibling()
    this.selectBookedTimeslots()
    this.broadcastSelection()
  }

  hoverTimeslot(event) {
    const targetTimeslotId = event.currentTarget.dataset.timeId

    const {startTime, endTime} = this.calculateStartAndEndTimeslots(targetTimeslotId, (this.startTimeslotValue || this.hoverStartTimeslotValue), (this.endTimeslotValue || this.hoverEndTimeslotValue))
    this.hoverStartTimeslotValue = startTime
    this.hoverEndTimeslotValue = endTime

    this.highlightPotentialBookingTimeslots()
  }

  clearHoverTimeslot(event) {
    this.hoverStartTimeslotValue = ''
    this.hoverEndTimeslotValue = ''
    this.highlightPotentialBookingTimeslots()
  }

  calculateStartAndEndTimeslots(targetTimeslotId, startTime = '', endTime = '') {
    const groupIndex = Number(targetTimeslotId.split('-')[0])
    const timeslotIndex = Number(targetTimeslotId.split('-')[1])
    const siblings = this.siblingTimeslotsValue[groupIndex]

    // If start time is empty and clicked timeslot is not last on its group
    if (!startTime && (timeslotIndex+ this.minimumTimeslotToBookValue) <= siblings.length) {
      startTime = targetTimeslotId
      endTime = `${groupIndex}-${timeslotIndex+ this.minimumTimeslotToBookValue - 1 }`
      return { startTime, endTime }
    }

    // If start is empty but selected timeslot is last of its group, we set it as endTimeslot and calculate startTimeslot
    if (!startTime && timeslotIndex + this.minimumTimeslotToBookValue > siblings.length) {
      startTime = `${groupIndex}-${siblings.length - this.minimumTimeslotToBookValue}`
      endTime = `${groupIndex}-${siblings.length - 1}`
      return { startTime, endTime }
    }

    // If start and end already exist and new time belongs to other group rerun function with empty start and end time
    if (startTime.split('-')[0] != groupIndex) {
      return this.calculateStartAndEndTimeslots(targetTimeslotId)
    }

    // If same timeslot group and clicked timeslot is past the existing end time slot
    if (startTime.split('-')[0] == groupIndex && endTime.split('-')[1] < timeslotIndex) {
      endTime = `${groupIndex}-${timeslotIndex}`
      return { startTime, endTime }
    }

    // If same timeslot group and clicked timeslot is before the existing start time slot
    if (startTime.split('-')[0] == groupIndex && startTime.split('-')[1] > timeslotIndex) {
      startTime = `${groupIndex}-${timeslotIndex}`
      return { startTime, endTime }
    }


    return { startTime, endTime }
  }

  disableInvalidSibling() {
    const groupIndex = this.startTimeslotValue.split('-')[0]

    this.timeslotLabelTargets.forEach(timeslotLabel => {
      const childCheckbox = timeslotLabel.querySelector('input')
      const thisGroupIndex = timeslotLabel.dataset.timeId.split('-')[0]
      childCheckbox.disabled = thisGroupIndex != groupIndex
      childCheckbox.checked = false
    })
  }

  selectBookedTimeslots() {
    const groupIndex = Number(this.startTimeslotValue.split('-')[0])
    const startIndex = Number(this.startTimeslotValue.split('-')[1])
    const endIndex = Number(this.endTimeslotValue.split('-')[1])

    this.timeslotLabelTargets.forEach(timeslotLabel => {
      const thisGroupIndex = Number(timeslotLabel.dataset.timeId.split('-')[0])

      if (thisGroupIndex != groupIndex) return

      const thisTimeslotIndex = Number(timeslotLabel.dataset.timeId.split('-')[1])
      const childCheckbox = timeslotLabel.querySelector('input')

      if (startIndex <= thisTimeslotIndex && thisTimeslotIndex <= endIndex) childCheckbox.checked = true
    })
  }

  highlightPotentialBookingTimeslots() {
    const groupIndex = Number(this.hoverStartTimeslotValue.split('-')[0])
    const startIndex = Number(this.hoverStartTimeslotValue.split('-')[1])
    const endIndex = Number(this.hoverEndTimeslotValue.split('-')[1])

    this.timeslotLabelTargets.forEach(timeslotLabel => {
      const thisGroupIndex = Number(timeslotLabel.dataset.timeId.split('-')[0])

      if (thisGroupIndex != groupIndex) return

      const thisTimeslotIndex = Number(timeslotLabel.dataset.timeId.split('-')[1])
      const childSpan = timeslotLabel.querySelector('span')
      const childCheckbox = timeslotLabel.querySelector('input')
      const shouldHighlight = startIndex <= thisTimeslotIndex && thisTimeslotIndex <= endIndex && !childCheckbox.checked

      childSpan.classList.toggle('bg-white', !shouldHighlight)
      childSpan.classList.toggle('bg-true-gray-300', shouldHighlight)
    })
  }
}

// Private templates
const htmlTimeslotsComponent = (siblingTimeslotsArray, minimumTimeslotToBook) => `
  <div class="border-2 border-black rounded-lg w-full h-full flex flex-col">
    <div class="w-full h-12 flex items-center justify-center border-b-2 border-black shrink-0" data-booking-time-target="firstStepTip">
      Select your start time
    </div>
    <div class="w-full h-12 flex items-center justify-center border-b-2 border-black shrink-0 hidden" data-booking-time-target="secondStepTip">
      Select your end time or <button class="bg-true-gray-200 ml-2 rounded-full text-gray-800 px-2" data-action="booking-time#clearTimeSelection">clear your selection</button>
    </div>
    <div class="w-full p-4 h-full overflow-y-scroll">
      <div class="grid grid-cols-1 gap-2">
        ${
          siblingTimeslotsArray.reduce((html, timeslots, groupIndex) => {
            return html + (groupIndex > 0 ? htmlSeparator() : '') + htmlTimeslots(timeslots, groupIndex, minimumTimeslotToBook)
          }, '')
        }
      </div>
    </div>
  </div>
`

const htmlTimeslots = (timeslots, groupIndex, minimumTimeslotToBook) => {
  if (timeslots.length < minimumTimeslotToBook) { return '' }

  return timeslots.reduce((html, timeslot, index) => {
    return html + htmlTimeslotButton(timeslot.start, timeslot.end, groupIndex, index)
  }, '')
}

const htmlSeparator = () => '<div class="w-full h-px my-2 border-b-4 border-dotted border-black"></div>'

const htmlTimeslotButton = (start, end, groupIndex, index) => `
  <label
    for="timeslot-${groupIndex}-${index}"
    data-action="click->booking-time#selectTimeslot mouseover->booking-time#hoverTimeslot mouseout->booking-time#clearHoverTimeslot"
    data-booking-time-target="timeslotLabel"
    data-time-start="${start}"
    data-time-end="${end}"
    data-time-id="${groupIndex}-${index}"
    aria-role="button"
    class="cursor-pointer"
  >
    <input type="checkbox" id="timeslot-${groupIndex}-${index}" class="peer sr-only"/>
    <span class="
      block
      w-full
      text-center
      p-2
      bg-white
      border-2
      border-black
      rounded
      transition-all
      duration-75
      hover:bg-true-gray-300
      peer-disabled:opacity-30
      peer-disabled:hover:bg-true-gray-300
      peer-disabled:hover:text-black
      peer-checked:bg-black
      peer-checked:border-black
      peer-checked:hover:border-black
      peer-checked:text-white
    ">
     <span class="sr-only">Click to book from </span> ${toReadableHour(start)} to ${toReadableHour(end)}
    </span>
  </label>
`
