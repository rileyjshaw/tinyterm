function autocomplete (target) {
  // naive
  function narrow (target, vals) {
    return vals.filter(function (val) {
      return !val.indexOf(target);
    });
  }

  var result = [];
  var words, cmd, args;

  if (target === '') {
    this.flash(true);
  } else {
    words = target.split(' ');

    if (words.length === 1 && target.slice(-1) !== ' ') {
      // trying to complete a command
      result = narrow(target, Object.keys(this.commands));
    } else {
      cmd = words[0];

      if (cmd) {
        args = this.commands[cmd].args;

        if (args) {
          result = narrow(words.slice(-1), args);
        }
      }
    }

    switch (result.length) {
      case 0:
        this.flash(true);
        break;
      case 1:
        this.input.value = words.slice(0, -1).concat(result).join(' ') + ' ';
        this.flashed = false;
        break;
      case 2:
        if (this.flashed) {
          this.print('> ' + target);
          this.print(result.join(' '));
        } else {
          this.flash();
        }
    }
  }

  return result;
}

// anything called asynchronously from process() runs in the bg
function process (cmd) {
  var args, out;

  cmd = cmd.split(' ');
  args = cmd.splice(1).filter(function (arg) {
    return arg.charAt(0) !== '-'; // strip options
  });
  // array to string
  cmd = cmd[0];

  if (this.commands[cmd]) {
    this.done(this.commands[cmd].fn.apply(this, args));
  } else {
    this.done('Command not found: ' + cmd);
  }
}

function register (name, args) {
  var fn, desc, aliases, command;

  if (typeof name !== 'string') {
    throw 'Must provide a name string to the TinyTerm constructor';
  }
  if (typeof args !== 'object') {
    throw 'Must provide an args object to the TinyTerm constructor';
  }

  fn = args.fn;
  desc = args.desc;
  aliases = args.aliases;

  if (typeof fn !== 'function') {
    throw 'args object requires a function "fn" in the TinyTerm constructor';
  }
  if (typeof desc !== 'string') {
    throw 'args object requires a string "desc" in the TinyTerm constructor';
  }

  this.commands[name] = command = {
    fn: fn,
    desc: desc
  };

  if (aliases && aliases.constructor === Array) {
    aliases.forEach((function (alias) {
      this.commands[alias] = command;
      this.aliases[alias] = true;
    }).bind(this));
  }
}

module.exports = {
  autocomplete: autocomplete,
  process: process,
  register: register
};
