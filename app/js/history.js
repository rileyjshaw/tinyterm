function back () {
  this.indices.cmdHistory = Math.min(
    this.indices.cmdHistory + 1,
    this.cmdHistory.length - 1
  );
  this.input.value = this.cmdHistory[this.indices.cmdHistory] || '';
}

function fwd () {
  this.indices.cmdHistory = Math.max(this.indices.cmdHistory - 1, -1);
  this.input.value = this.cmdHistory[this.indices.cmdHistory] || '';
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
