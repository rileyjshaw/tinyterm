function clickHandler () {
  if (window.getSelection().toString() === '') {
    this.focus();
  }
}

function inputHandler (e) {
  this.mirrorInner.textContent = this.input.value;
}

function keyDownHandler (e) {
  var key;

  e = e || window.event;
  key = e.keyCode;

  if (key === 9) { // tab
    e.preventDefault();

    if (!this.keysDown[9]) {
      this.autocomplete(this.input.value);
      this.keysDown[9] = true;
    }
  } else if (key === 13 && !(this.keysDown[16] || this.keysDown[18])) {
    e.preventDefault();
    submitHandler.call(this);
  } else if (!this.keysDown[key]) {
    this.keysDown[key] = true;

    if (key === 38) { // up
      this.historyBack();
    } else if (key === 40) { // down
      this.historyFwd();
    }

    if (this.flashed) {
      this.flashed = false;
    }
  }
}

function keyUpHandler (e) {
  var key;

  e = e || window.event;
  key = e.keyCode;

  if (this.keysDown[key]) {
    this.keysDown[key] = false;
  }
}

function submitHandler (e) {
  e = e || window.event;
  if (e) {
    e.preventDefault();
  }

  this.run();
}

function init (term, parent) {
  var fontStyle, fontSize, fontFamily, color, textShadow, charWidth;
  var fontProbe = document.createElement('div');
  var style = document.createElement('style');
  var container = document.createElement('div');
  var form = document.createElement('form');
  var inputContainer = document.createElement('div');
  var mirror = document.createElement('pre');
  var mirrorInner = document.createElement('span');
  var input = document.createElement('textarea');

  container.classList.add('tinyterm');
  inputContainer.classList.add('expander');

  fontProbe.textContent = '>';
  fontProbe.className = 'tinytermFontProbe';

  input.name = 'prompt';
  input.autocomplete = input.autocorrect = input.autocapitalize = 'off';
  input.spellcheck = false;

  mirror.appendChild(mirrorInner);
  mirror.appendChild(document.createElement('br'));
  inputContainer.appendChild(mirror);
  inputContainer.appendChild(input);
  form.appendChild(inputContainer);
  container.appendChild(fontProbe);
  container.appendChild(form);

  if (typeof parent !== 'object' || container.nodeName !== 'DIV') {
    parent = document.body;
  }

  parent.appendChild(container);

  fontStyle = window.getComputedStyle(fontProbe);
  fontSize = fontStyle.getPropertyValue('font-size');
  fontFamily = fontStyle.getPropertyValue('font-family');
  color = fontStyle.getPropertyValue('color');
  textShadow = fontStyle.getPropertyValue('text-shadow');
  fontProbe.style.fontSize = '20em';
  charWidth = fontProbe.offsetWidth / 20;
  container.removeChild(fontProbe);

  document.head.appendChild(style);

  sheet = style.sheet;
  sheet.insertRule('.tinyterm code, .tinyterm pre, .tinyterm textarea {\
    font-size: ' + fontSize + ';\
    font-family: ' + fontFamily + ';\
    color: ' + color + ';\
    text-shadow: ' + textShadow + '\
  }', 0);
  sheet.insertRule('.tinyterm code, .tinyterm .expander {\
    margin-left: ' + charWidth * 2 + 'px\
  }', 0);
  sheet.insertRule('.tinyterm code {\
    text-indent: -' + charWidth * 2 + 'px\
  }', 0);

  container.addEventListener('click', clickHandler.bind(term));
  input.addEventListener('keydown', keyDownHandler.bind(term));
  input.addEventListener('keyup', keyUpHandler.bind(term));
  input.addEventListener('input', inputHandler.bind(term));
  form.addEventListener('submit', submitHandler.bind(term));

  // added verbatim to TinyTerm object
  return {
    container: container,
    form: form,
    input: input,
    mirrorInner: mirrorInner
  };
}

module.exports = {
  init: init
};
