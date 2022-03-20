/* eslint-disable no-undef */
// Scroll warp effect
import scrollWarp from './lib/scroll-warp'
import scrollbarPadding from './lib/scrollbar-padding'

// GIF 3D rotation effect
// import RubbableGif from './vendors/rubbable'

// Stimulus JS
import { Application } from '@hotwired/stimulus'
import AppController from './controllers/app_controller'
import OverlayController from './controllers/overlay_controller'
import BookingController from './controllers/booking_controller'
import BookingCalendarController from './controllers/booking_calendar_controller'
import BookingMonthsController from './controllers/booking_months_controller'
import BookingTimeController from './controllers/booking_time_controller'
import BookingCartController from './controllers/booking_cart_controller'
import BookingFormController from './controllers/booking_form_controller'

window.Stimulus = Application.start()
Stimulus.register('app', AppController)
Stimulus.register('overlay', OverlayController)
Stimulus.register('booking', BookingController)
Stimulus.register('booking-months', BookingMonthsController)
Stimulus.register('booking-calendar', BookingCalendarController)
Stimulus.register('booking-time', BookingTimeController)
Stimulus.register('booking-cart', BookingCartController)
Stimulus.register('booking-form', BookingFormController)

const warpConfig = {
  num: 2,
  theta: 1.1,
}

// Initialize everthing after jQuery is ready
$(function () {
  const $content = $('#content')[0]
  scrollbarPadding()
  scrollWarp($content, 100, warpConfig.num, warpConfig.theta)

  // Init Rubabble - TODO: Move to its own controller
  // if (window.innerWidth >= 600) {
  //   const sup2 = new RubbableGif({ gif: document.getElementById('studio-desktop') })
  //   sup2.load()
  // } else {
  //   const sup2 = new RubbableGif({ gif: document.getElementById('studio-mobile') })
  //   sup2.load()
  // }
})
