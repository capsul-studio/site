// Hack to detect device scrollbar width.
// When a mouse is plugged in, the contents of an element will shift over to accomodate the scrollbar.
// We will detect this and shift the .panel-content's to the left via padding-right, else the panels and the main content view become out of sync.
const scrollbarPadding = () => {
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
};

export default scrollbarPadding;