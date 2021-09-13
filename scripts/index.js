// Hack to detect device scrollbar width.
// When a mouse is plugged in, the contents of an element will shift over to accomodate the scrollbar.
// We will detect this and shift the .panel-content's to the left via padding-right, else the panels and the main content view become out of sync.
(function () {
  var div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.overflow = 'scroll';
  div.style.position = 'absolute';
  div.style.top = '-9999px';
  document.body.appendChild(div);

  var scrollBarWidth = div.offsetWidth - div.clientWidth;

  document.body.removeChild(div);

  var style = document.createElement('style');
  document.querySelector('head').appendChild(style);

  var selector = '.panel-content';
  var rule = `padding-right: ${scrollBarWidth}px`;

  if (style.sheet) {
    if (style.sheet.insertRule) style.sheet.insertRule(`${selector} {${rule}}`, 0);
    else style.sheet.addRule(selector, rule);
  }
  else if (style.styleSheet) style.styleSheet.addRule(selector, rule);
})();
// document.getElementById("book").addEventListener("click", hello);
// function hello() {
// alert('Hello');
// }


var slideDown = false
function ani() {
  console.log("inani")
  if(!slideDown){
    document.getElementById('ontop').classList.remove('top-animate-backward')
    document.getElementById('ontop').classList.add('top-animate-forward');
    slideDown=true;
  }else{
    document.getElementById('ontop').classList.remove('top-animate-forward')
    document.getElementById('ontop').classList.add('top-animate-backward')
    slideDown=false;
  }

}


// document.getElementById("change").onclick = function() {myFunction()};

// function myFunction() {
//   var container = document.getElementById('container');
//   container.style.left =`30%`

//   // container.style.perspective =`200px`
//   container.style.perspectiveOrigin =`-100%`

// }

// Each articulation panel consists of three DOM elements
//  - a grandparent for 3d positioning
//  - a parent for clipping
//  - and a child to hold and 'scroll' content via changing transforms
function panel(html) {
  var panelNode = document.createElement('div');
  var panelCutoutNode = document.createElement('div');
  var panelContentNode = document.createElement('div');
    
  panelNode.classList.add('panel-node');
  
  panelCutoutNode.classList.add('panel-cutout');
  
  panelContentNode.innerHTML = html;
  panelContentNode.classList.add('panel-content');
  
  panelCutoutNode.appendChild(panelContentNode);
  panelNode.appendChild(panelCutoutNode);
  
  return panelNode;
}

// Keep the content panels in sync by translating them up or down according to the scroll distance
function syncPanelContent(tops, bottoms, scrollTop, containerHeight, panelHeight) {
  for (var i = 0; i < tops.length; i++) {
    var t = tops[i];
    var b = bottoms[i];
    var tTop = (i) * panelHeight - scrollTop;
    var bTop = -i * panelHeight - scrollTop - containerHeight;
    t.style.transform = `translate3d(0,${tTop}px,0)`;
    b.style.transform = `translate3d(0,${bTop}px,0)`;
  }
}

function transYrotX(y,x) {
  return `translate3d(0,${y}px,0) rotateX(${x}rad) rotateY(0)`;
}
var tops = [];
var bottoms = [];

// Create num top and bottom panels based off the innerHTML of el with articulation angle.
// We nest panels and use `transform-style: preserve-3d` to get the tentacle curl effect.
// Should probably only use this on relatively simple el's, because we are going to need to create 2 * num deep copies of el and attach them to the DOM. Needless to say, this will scale poorly.
function createScrollOverlay(el, panelHeight, num, angle) {

  var topParent = el.parentNode;
  var bottomParent = el.parentNode;

  var html = el.innerHTML;
  
  var totalTheta = 0;
  
  for (var i = 0; i < num; i++) {
    var topPanel = panel(html);
    var bottomPanel = panel(html);

    topPanel.style.height = `${panelHeight}px`;
    bottomPanel.style.height = `${panelHeight}px`;

    topPanel.style.transformOrigin = '50% 100% 0';

    // topPanel.style.transformOrigin = '50% 0% 0';
    bottomPanel.style.transformOrigin = '50% 0% 0';
    
    var topPanelContent = topPanel.querySelector('.panel-content');
    var bottomPanelContent = bottomPanel.querySelector('.panel-content');

    if (i === 0) {
      topPanel.style.transform = transYrotX(panelHeight, 0);
      topPanel.style.bottom = '100%';
      topPanelContent.style.visibility = 'hidden';
      topPanelContent.style.overflow = 'hidden';

      bottomPanel.style.top = '100%';
      bottomPanelContent.style.visibility = 'hidden';
      bottomPanelContent.style.overflow = 'hidden';
      bottomPanel.style.transform = transYrotX(0, 0);
      // bottomPanel.classList.add('bottom-cutout')
    }
    else {
      // topPanel.style.width = '115%';
      bottomPanel.classList.add('gradient');
      // bottomPanelContent.classList.add('gradient')
      bottomPanel.classList.add('bottom-panel')

      // topPanel.classList.add('disappear')
      // bottomPanelContent.classList.add('disappear')
      // topPanelContent.classList.add('disappear')
      topPanelContent.style.opacity = "0.5"
      bottomPanelContent.style.opacity="0.5"
      topPanelContent.style.border = "none"

      bottomPanelContent.style.border = "none"
      topPanelContent.style.zIndex = "5"

      topPanel.classList.add('top-panel')
      topPanel.classList.add('gradient');


      topPanel.style.transform = transYrotX(-panelHeight - 0.25, -angle);
      bottomPanel.style.transform = transYrotX(panelHeight - 0.25, angle);
     // bottomPanel.style.transform = transYrotX(panelHeight - 0.25, angle);

      // topPanel.style.transform = transYrotX(panelHeight - 0.25, angle);
      // bottomPanel.style.transform = transYrotX(panelHeight - 0.25, angle);
      // topPanel.style.transform = transYrotX(-panelHeight + 0.25, angle);
      // bottomPanel.style.transform = transYrotX(panelHeight - 0.25, angle);
      // topPanel.style.borderBottom="solid";
      // bottomPanel.style.borderTop="solid";

      // topPanel.style.borderLeft="solid";
      // topPanel.style.borderRight="solid";
      // bottomPanel.style.borderLeft="solid";
      // bottomPanel.style.borderRight="solid";

      totalTheta += angle;
      totalTheta %= 2 * Math.PI;
      // if (Math.PI * (1 / 2) < totalTheta && totalTheta < Math.PI * (3 / 2)) {
      //   topPanelContent.classList.add('backface');
      //   bottomPanelContent.classList.add('backface');
      // }
    }

    angle += 0.025;

    tops.push(topPanelContent);
    bottoms.push(bottomPanelContent);

    topParent.appendChild(topPanel);
    bottomParent.appendChild(bottomPanel);

    topParent = topPanel;
    bottomParent = bottomPanel;
  }

  syncPanelContent(tops, bottoms, 0, container.clientHeight, panelHeight);

  function update() {
    var scrollTop = el.scrollTop;
    var containerHeight = container.clientHeight;
    requestAnimationFrame(function() {
      syncPanelContent(tops, bottoms, scrollTop, containerHeight, panelHeight);
    });

  }
 
  el.onscroll = update;
  window.onresize = update;
  // setInterval(function() {el.scrollTop++}, 32)
}
var theta = 1.1;
var num = 2;
// var theta = 1.3;


var $ = document.querySelector.bind(document);
createScrollOverlay($('#content'), 100, num, theta);
  function message(input) {
    $('#content').scrollTop = $("#content").offsetTop
  }
  function message1(input) {
    $('#content').scrollTop = $("#gallery").offsetTop
  }
  function message2(input) {

    $('#content').scrollTop = $("#amenities").offsetTop
  }
  function message3(input) {
    $('#content').scrollTop = $("#location").offsetTop
  }
  function message4(input) {
    $('#content').scrollTop = $("#contact").offsetTop
  }
 function init(){
  
    document.getElementById("about-button").addEventListener("click", message, true);
    document.getElementById("gallery-button").addEventListener("click", message1, true);
    document.getElementById("amenities-button").addEventListener("click", message2, true);
    document.getElementById("location-button").addEventListener("click", message3, true);
    document.getElementById("contact-button").addEventListener("click", message4, true);
  };
document.addEventListener('DOMContentLoaded', init, false);

