import scrollWarp from "./lib/scroll-warp";
import scrollbarPadding from "./lib/scrollbar-padding";
import RubbableGif from "./vendors/rubbable";

const warpConfig = {
  num: 2,
  theta: 1.1,
}

// initialize everthing after jQuery is ready
$(function() {
  const $content = $('#content')[0];
  scrollbarPadding();
  scrollWarp($content, 100, warpConfig.num, warpConfig.theta);

  // BIND MENU LINKS - TODO: Move to its own controller
  const menuLinks = document.querySelectorAll('a[data-js="menu-link"]');
  menuLinks.forEach(link => {
    const linkTarget = link.href;
    $content.scrollTop = linkTarget.offsetTop;
  });

  // Init Rubabble - TODO: Move to its own controller
  if (window.innerWidth >= 600) {
    var sup2 = new RubbableGif({gif: document.getElementById('studio-desktop')});
    sup2.load();
  } else {
    var sup2 = new RubbableGif({gif: document.getElementById('studio-mobile')});
    sup2.load();
  }
});


