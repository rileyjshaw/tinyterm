!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.TinyTerm=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function TinyTerm (parent) {
  var style, sheet, container, form, input, widthProbe, charWidth;

  this.commands = {
    help: {
      fn: this.help,
      desc: 'Display helpful information about builtin commands.'
    }
  };
  this.loadIndex = 0;
  this.loadInterval = null;
  this.cmdHistory = [];
  this.cmdHistoryIndex = -1;
  this.keysDown = {};
  this.flashed = false;
  this.aliases = {};

  // DOM stuff
  style = document.createElement('style');
  widthProbe = document.createElement('div');
  container = this.container = document.createElement('div');
  form = this.form = document.createElement('form');
  input = this.input = document.createElement('input');

  container.classList.add('tinyterm');

  widthProbe.className = 'tinytermWidthProbe';
  widthProbe.textContent = '>';

  input.type = 'text';
  input.name = 'prompt';
  input.autocomplete = input.autocorrect = input.autocapitalize = 'off';
  input.spellcheck = false;

  form.addEventListener('submit', this.run.bind(this));

  input.addEventListener('keydown', (function (e) {
    var key;

    e = e || window.event;
    key = e.keyCode;

    if (key === 9) { // tab
      e.preventDefault();
    }

    if (!this.keysDown[key]) {
      this.keysDown[key] = true;

      if (key === 9) { // tab
        this.autocomplete(this.input.value);
      } else {
        if (key === 38) { // up
          this.cmdHistoryIndex = Math.min(
            this.cmdHistoryIndex + 1,
            this.cmdHistory.length - 1
          );
          input.value = this.cmdHistory[this.cmdHistoryIndex] || '';
        } else if (key === 40) { // down
          this.cmdHistoryIndex = Math.max(this.cmdHistoryIndex - 1, -1);
          input.value = this.cmdHistory[this.cmdHistoryIndex] || '';
        }

        if (this.flashed) {
          this.flashed = false;
        }
      }

    }
  }).bind(this), false);

  input.addEventListener('keyup', (function (e) {
    var key;

    e = e || window.event;
    key = e.keyCode;

    this.keysDown[key] = false;
  }).bind(this), false);

  container.addEventListener('click', (function () {
    this.focus();
  }).bind(this), false);

  container.appendChild(widthProbe);
  container.appendChild(form);
  form.appendChild(input);

  if (typeof parent !== 'object' || container.nodeName !== 'DIV') {
    parent = document.body;
  }

  parent.appendChild(container);

  charWidth = widthProbe.offsetWidth / 20;
  container.removeChild(widthProbe);

  document.head.appendChild(style);

  sheet = style.sheet;
  sheet.insertRule('.tinyterm p, .tinyterm input {\
    padding-left: ' + charWidth * 2 + 'px\
  }', 0);
  sheet.insertRule('.tinyterm p {\
    text-indent: -' + charWidth * 2 + 'px\
  }', 0);

}

function loadAnimation (term) {
  term.input.value = loadStates[term.loadIndex++];
  term.loadIndex = term.loadIndex % 4;
}

TinyTerm.prototype.help = function (cmd) {
  cmd = this.commands[cmd];

  if (cmd) {
    return cmd.desc;
  } else {
    return Object.keys(this.commands).filter((function (key) {
      return !this.aliases[key];
    }).bind(this)).map((function (key) {
      return key + ': ' + this.commands[key].desc;
    }).bind(this));
  }
};

var loadStates = ['/', '-', '\\', '|'];

TinyTerm.prototype.startLoading = function () {
  this.input.disabled = true;
  this.loadInterval = window.setInterval(loadAnimation.bind(null, this), 120);
};

TinyTerm.prototype.stopLoading = function (disabled) {
  if (this.loadInterval) {
    window.clearInterval(this.loadInterval);
    this.loadInterval = null;

    this.input.value = '';
    if (!disabled) {
      this.input.disabled = false;
    }
  }
};

TinyTerm.prototype.flash = function (allowRepeat) {
  this.container.classList.add('flash');

  window.setTimeout((function () {
    this.container.classList.remove('flash');
  }).bind(this), 84);

  if (!allowRepeat) {
    this.flashed = true;
  }
};

TinyTerm.prototype.focus = function () {
  this.input.focus();
};

TinyTerm.prototype.realign = function () {
  this.container.scrollTop = this.container.scrollHeight;
  this.focus();
};

TinyTerm.prototype.print = function (str, tag) {
  if (typeof tag !== 'string') {
    tag = 'p';
  }

  if (str) {
    if (str.constructor === Array) {
      str.forEach(this.print.bind(this));
    } else {
      this.form.insertAdjacentHTML('beforebegin', '<' + tag + '>' + str +
        '</' + tag + '>');
    }
  }
};

TinyTerm.prototype.autocomplete = function (target) {
  // naive
  function narrow (target, vals) {
    return vals.filter(function (val) {
      return !val.indexOf(target);
    });
  }

  var result = [];
  var words, cmd, args;

  if (target === '') {
    this.flash(true);
  } else {
    words = target.split(' ');

    if (words.length === 1 && target.slice(-1) !== ' ') {
      // trying to complete a command
      result = narrow(target, Object.keys(this.commands));
    } else {
      cmd = words[0];

      if (cmd) {
        args = this.commands[cmd].args;

        if (args) {
          result = narrow(words.slice(-1), args);
        }
      }
    }

    switch (result.length) {
      case 0:
        this.flash(true);
        break;
      case 1:
        this.input.value = words.slice(0, -1).concat(result).join(' ') + ' ';
        this.flashed = false;
        break;
      case 2:
        if (this.flashed) {
          this.print('> ' + target);
          this.print(result.join(' '));
        } else {
          this.flash();
        }
    }
  }

  this.realign();
  return result;
};

TinyTerm.prototype.done = function (out) {
  this.print(out);
  this.stopLoading();
  this.realign();
};

TinyTerm.prototype.process = function (cmd) {
  var args, out;

  cmd = cmd.split(' ');
  args = cmd.splice(1).filter(function (arg) {
    return arg.charAt(0) !== '-'; // strip options
  });
  // array to string
  cmd = cmd[0];

  if (this.commands[cmd]) {
    this.done(this.commands[cmd].fn.apply(this, args));
  } else {
    this.done('Command not found: ' + cmd);
  }
};

TinyTerm.prototype.run = function (e) {
  var cmd;

  e = e || window.event;
  if (e) e.preventDefault();

  cmd = this.form.prompt.value;
  this.form.reset();
  this.startLoading();

  this.print('> ' + cmd);

  this.cmdHistory = [cmd].concat(this.cmdHistory).slice(0, 60);
  this.cmdHistoryIndex = -1;
  if (this.flashed) {
    this.flashed = false;
  }

  try {
    this.process(cmd);
  } catch (err) {
    this.done(err.toString());
  }
};

TinyTerm.prototype.register = function (name, args) {
  var fn, desc, aliases, command;

  if (typeof name !== 'string') {
    throw 'Must provide a name string to the TinyTerm constructor';
  }
  if (typeof args !== 'object') {
    throw 'Must provide an args object to the TinyTerm constructor';
  }

  fn = args.fn;
  desc = args.desc;
  aliases = args.aliases;

  if (typeof fn !== 'function') {
    throw 'args object requires a function "fn" in the TinyTerm constructor';
  }
  if (typeof desc !== 'string') {
    throw 'args object requires a string "desc" in the TinyTerm constructor';
  }

  this.commands[name] = command = {
    fn: fn,
    desc: desc
  };

  if (aliases && aliases.constructor === Array) {
    aliases.forEach((function (alias) {
      this.commands[alias] = command;
      this.aliases[alias] = true;
    }).bind(this));
  }
};

module.exports = TinyTerm;

},{}]},{},[1])(1)
});