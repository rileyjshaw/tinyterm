var animation = require('./animation');
var DOM = require('./dom');
var history = require('./history');
var run = require('./run');
var shell = require('./shell');
var util = require('./util');

function TinyTerm (parent) {
  var domNodes;

  this.commands = {
    help: {
      fn: this.help,
      desc: 'Display helpful information about builtin commands.'
    }
  };

  this.indices = {
    loader: 0,
    cmdHistory: -1
  };

  this.loadInterval = null;
  this.cmdHistory = [];
  this.keysDown = {};
  this.flashed = false;
  this.aliases = {};

  domNodes = DOM.init(this, parent);
  Object.keys(domNodes).forEach((function (key) {
    this[key] = domNodes[key];
  }).bind(this));
}

TinyTerm.prototype.startLoading = animation.startLoading;
TinyTerm.prototype.stopLoading = animation.stopLoading;
TinyTerm.prototype.flash = history.flash;
TinyTerm.prototype.historyBack = history.back;
TinyTerm.prototype.historyFwd = history.fwd;
TinyTerm.prototype.focus = util.focus;
TinyTerm.prototype.help = util.help;
TinyTerm.prototype.print = util.print;
TinyTerm.prototype.autocomplete = shell.autocomplete;
TinyTerm.prototype.process = shell.process;
TinyTerm.prototype.register = shell.register;
TinyTerm.prototype.run = run;

module.exports = TinyTerm;
