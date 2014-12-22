function back () {
  var newIndex = this.indices.cmdHistory + 1;
  var historyLength = this.cmdHistory.length - 1;

  if (newIndex > historyLength) {
    newIndex = historyLength;
    this.flash(true);
  }

  this.indices.cmdHistory = newIndex;
  this.input.value = this.cmdHistory[newIndex] || '';
}

function fwd () {
  var newIndex = this.indices.cmdHistory - 1;

  if (newIndex < 0) {
    newIndex = -1;
    this.flash(true);
  }

  this.indices.cmdHistory = newIndex;
  this.input.value = this.cmdHistory[newIndex] || '';
}

function flash (allowRepeat) {
  this.container.classList.add('flash');

  window.setTimeout((function () {
    this.container.classList.remove('flash');
  }).bind(this), 84);

  if (!allowRepeat) {
    this.flashed = true;
  }
}

module.exports = {
  back: back,
  fwd: fwd,
  flash: flash
};
