module.exports = function run () {
  var cmd, out;

  cmd = this.form.prompt.value;
  this.form.reset();
  this.mirrorInner.textContent = '';
  this.startLoading();

  this.print('>&nbsp;' + cmd);

  this.cmdHistory = [cmd].concat(this.cmdHistory).slice(0, 60);
  this.indices.cmdHistory = -1;
  if (this.flashed) {
    this.flashed = false;
  }

  try {
    out = this.process(cmd);
  } catch (err) {
    out = err.toString();
  }

  this.print(out);
  this.stopLoading();
};
