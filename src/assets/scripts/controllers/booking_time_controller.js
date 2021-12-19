import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["timeslotLabel", "firstStepTip", "secondStepTip"]

  static values = {
    siblingTimeslots: Array,
    minimumTimeslotToBook: Number,
    startTimeslot: String,
    endTimeslot: String,
  }

  update(newState) {
    try {
      if (newState.date === this.currentDateValue) return
      if (!newState.date) { this.clear(); return }

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

  clear() {
    this.element.innerHTML = ''
  }

  clearTimeSelection() {
    this.startTimeslotValue = ''
    this.endTimeslotValue = ''
    this.render()
  }

  startTimeslotValueChanged() {
    Promise.resolve().then(() => {
      this.toggleFirstStepTip(!this.startTimeslotValue)
      this.toggleSecondStepTip(!!this.startTimeslotValue)
    })
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
    this.setStartAndEndTimeslots(targetTimeslotId)
    this.disableInvalidSibling()
    this.selectBookedTimeslots()
  }

  setStartAndEndTimeslots(targetTimeslotId) {
    const groupIndex = Number(targetTimeslotId.split('-')[0])
    const timeslotIndex = Number(targetTimeslotId.split('-')[1])
    const siblings = this.siblingTimeslotsValue[groupIndex]

    // check if start is empty and not last sibling
    if (!this.startTimeslotValue && (timeslotIndex+ this.minimumTimeslotToBookValue) <= siblings.length) {
      this.startTimeslotValue = targetTimeslotId
      this.endTimeslotValue = `${groupIndex}-${timeslotIndex+ this.minimumTimeslotToBookValue - 1 }`
      return
    }

    // If start is empty but selected timeslot is last of siblings array -> set this as endTimeslot and generate startTimeslot
    if (!this.startTimeslotValue && timeslotIndex + this.minimumTimeslotToBookValue > siblings.length) {
      this.startTimeslotValue = `${groupIndex}-${siblings.length - this.minimumTimeslotToBookValue}`
      this.endTimeslotValue = `${groupIndex}-${siblings.length - 1}`
      return
    }

    // If start and end already exists and new time belongs to other group reset and rerun function
    if (this.startTimeslotValue.split('-')[0] != groupIndex) {
      this.clearTimeSelection()
      this.setStartAndEndTimeslots(targetTimeslotId)
      return
    }

    if (this.startTimeslotValue.split('-')[0] == groupIndex && this.endTimeslotValue.split('-')[1] < timeslotIndex) {
      this.endTimeslotValue = `${groupIndex}-${timeslotIndex}`
      return
    }


    // check if end already exists and belongs to same group
    // check if last of siblings and change start to N timeslots before where N is minimumBookValue
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
}

// Private templates

htmlTimeslotsComponent = (siblingTimeslotsArray, minimumTimeslotToBook) => `
  <div class="border-2 border-black rounded-lg w-full h-full flex flex-col">
    <div class="w-full h-12 flex items-center justify-center border-b-2 border-black shrink-0" data-booking-time-target="firstStepTip">
      Select your start time
    </div>
    <div class="w-full h-12 flex items-center justify-center border-b-2 border-black shrink-0 hidden" data-booking-time-target="secondStepTip">
      Select your end time or <button class="underline ml-2" data-action="booking-time#clearTimeSelection">clear your selection</button>
    </div>
    <div class="w-full p-4 h-full overflow-y-scroll">
      <div class="grid grid-cols-1 gap-2">
        ${
          siblingTimeslotsArray.reduce((html, timeslots, groupIndex) => {
            return groupIndex > 0 ? html + htmlSeparator() + htmlTimeslots(timeslots, groupIndex, minimumTimeslotToBook) :  html + htmlTimeslots(timeslots, groupIndex, minimumTimeslotToBook)
          }, '')
        }
      </div>
    </div>
  </div>
`

htmlTimeslots = (timeslots, groupIndex, minimumTimeslotToBook) => {
  if (timeslots.length < minimumTimeslotToBook) {
    return ''
  }

  return timeslots.reduce((html, timeslot, index) => {
    return html + htmlTimeslotButton(timeslot.start, timeslot.end, groupIndex, index)
  }, '')
}

htmlSeparator = () => '<div class="w-full h-px my-2 border-b-4 border-dotted border-black"></div>'

htmlTimeslotButton = (start, end, groupIndex, index) => `
  <label
    for="timeslot-${groupIndex}-${index}"
    data-action="click->booking-time#selectTimeslot"
    data-booking-time-target="timeslotLabel"
    data-time-start="${start}"
    data-time-end="${end}"
    data-time-id="${groupIndex}-${index}"
    aria-role="button"
    class="cursor-pointer"
  >
    <input type="checkbox" id="timeslot-${groupIndex}-${index}" class="peer sr-only"/>
    <span class="block bg-white w-full text-center p-2 border-2 border-black rounded hover:bg-black hover:text-white peer-disabled:opacity-30 peer-disabled:hover:bg-white peer-disabled:hover:text-black peer-checked:bg-black peer-checked:text-white">
      <span class="sr-only">Click to book from </span> ${start.substring(11,16)} to ${end.substring(11,16)}
    </span>
  </label>
`
