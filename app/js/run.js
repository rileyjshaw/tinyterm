module.exports = function run (cb) {
  var cmd, out;

  cmd = this.form.prompt.value;
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
    // propagate the error
    throw err;
  } finally {
    this.stopLoading();
    this.form.reset();
    this.mirrorInner.textContent = '';
    this.print(out);

    if (typeof cb === 'function') {
      cb();
    }
  }
};
