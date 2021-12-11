import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['content', 'navItem'];

  connect() {
    this.bindNavItems();
  }

  bindNavItems() {
    this.navItemTargets.forEach(navItem => {
      // this.contentTarget.scrollTop = navItem.href.offsetTop;
    });
  }
}
