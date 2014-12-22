function help (cmd) {
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
}

function focus () {
  this.input.focus();
}

function print (str, tag) {
  if (typeof tag !== 'string') {
    tag = 'code';
  }

  // checks for null and undefined
  if (str != null) {
    if (str.constructor === Array) {
      str.forEach(this.print.bind(this));
    } else {
      this.form.insertAdjacentHTML('beforebegin', '<' + tag + '>' + str +
        '</' + tag + '>');
    }
  }

  this.container.scrollTop = this.container.scrollHeight;
  this.focus();
}

module.exports = {
  help: help,
  focus: focus,
  print: print
};
