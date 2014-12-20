function loadAnimation (term) {
  term.input.value = loadStates[term.indices.loader++];
  term.indices.loader = term.indices.loader % 4;
}

function startLoading () {
  this.input.disabled = true;
  this.loadInterval = window.setInterval(loadAnimation.bind(null, this), 120);
}

function stopLoading (disabled) {
  if (this.loadInterval) {
    window.clearInterval(this.loadInterval);
    this.loadInterval = null;

    this.input.value = '';
    if (!disabled) {
      this.input.disabled = false;
    }
  }
}

var loadStates = ['/', '-', '\\', '|'];

module.exports = {
	startLoading: startLoading,
	stopLoading: stopLoading
};
