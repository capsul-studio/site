var tops = [];
var bottoms = [];

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

// Create num top and bottom panels based off the innerHTML of el with articulation angle.
// We nest panels and use `transform-style: preserve-3d` to get the tentacle curl effect.
// Should probably only use this on relatively simple el's, because we are going to need to create 2 * num deep copies of el and attach them to the DOM. Needless to say, this will scale poorly.
export default function scrollWarp(el, panelHeight, num, angle) {
  console.log(el);
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
}