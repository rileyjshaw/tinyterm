!function () {
  function init () {
    var term = new TinyTerm(document.querySelector('.container'));

    term.process = eval;

    console.log = term.print.bind(term);
    console.log('&nbsp;');
    console.log('Property of World Incorporated, 1995.')
    console.log('Created with <a href="//github.com/rileyjshaw/tinyterm">TinyTerm</a>.');
    term.focus();
  }

  if (typeof WebFont === 'object') {
    WebFont.load({
      google: { families: ['VT323'] },
      active: init
    });
  } else {
    init();
  }
}();
