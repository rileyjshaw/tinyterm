WebFont.load({
  google: { families: ['Press Start 2P'] },
  active: init
});

function init () {
  var term = new TinyTerm(document.querySelector('.container'));

  term.register('echo', {
    fn: function () {
      return Array.prototype.slice.call(arguments).join(' ');
    },
    desc: 'Write arguments to the standard output.'
  });

  term.register('js', {
    fn: function () {
      var args = Array.prototype.slice.call(arguments).join(' ');
      return eval(args);
    },
    desc: 'Run arbitrary JS code.'
  });

  window.console.log = term.print.bind(term);
  term.focus();
}
