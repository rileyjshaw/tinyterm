!function () {
  function init () {
    var term = new TinyTerm(document.querySelector('.container'));

    term.process = eval;

    window.console.log = term.print.bind(term);
    term.print('&nbsp;');
    term.focus();
  }

  if (typeof WebFont === 'object') {
    WebFont.load({
      google: { families: ['Press Start 2P'] },
      active: init
    });
  } else {
    init();
  }
}();
