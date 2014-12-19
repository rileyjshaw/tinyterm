Tinyterm
=====

__This is still in super-alpha mode. It is a bit buggy, and it is very messy. You've been warned.__

The tiniest in-browser terminal you've ever seen. Check it out [here](http://rileyjshaw.com/tinyterm).

## Installation
tinyterm can be installed using [npm](https://www.npmjs.org/package/tinyterm), [bower](http://bower.io/), or included from [jsdelivr](http://cdn.jsdelivr.net/tinyterm/latest/mainfile):
```bash
npm install tinyterm
```
```bash
bower install tinyterm
```
```html
<script src="//cdn.jsdelivr.net/tinyterm/latest/mainfile"></script>
```

The library uses a [universal module definition](https://github.com/umdjs/umd), so it _should_ work with whatever system you're using.

## Usage
## Creating a TinyTerm
Initialize a TinyTerm with:

```javascript
var term = new TinyTerm(container);
```

If a DOM element is passed in as `container`, the TinyTerm element is appended to it. Otherwise, TinyTerm appends to `document.body`.

### Adding commands
Add commands with the `register` method:

```javascript
term.register('echo', {
  // required
  fn: function (arg1, arg2, arg3, /* ... */) {
    print(Array.prototype.join.call(arguments, ' '));
  },
  // required
  desc: 'Write arguments to the standard output.',
  // optional, enables tab autocomplete
  arguments: ['foo', 'bar'],
  // optional alternate names for the command
  aliases: ['print', 'log']
});
```

The methods `autocomplete`, `done`, `flash`, `help`, `print`, `process`, `realign`, `run`, `startLoading`, and `stopLoading` are also exposed... you probably won't need to use them.

## Contributing
Pull-requests to the `/app` directory are welcome. Please create an [issue](https://github.com/rileyjshaw/tinyterm/issues) if you plan on adding features, as it might be better suited to a plugin.

Please squash changes down to a single commit before making a pull-request.

### Building the library
If you don't have [gulp](http://gulpjs.com/), you'll have to install it:
```bash
npm install -g gulp
```

After running
```bash
npm install
```
in the main directory, running
```bash
gulp
```
will watch the `/app` directory and build any changes to `/dist`.

### Style
Pull requests _must_ adhere to the following code style guidelines, influenced heavily by [idiomatic.js](https://github.com/rwaldron/idiomatic.js/):

 - Put a space before the parens following `if ()`, `else if ()`, `for ()`, `while ()`, `try ()`, and `function ()` statements. Do not add padding spaces _within_ these parens.
 - Put a space between closing braces `)` and opening curly braces `{`.
 - Add padding spaces to curly braces that self-close on a single line: `var littleObject = { name: 'tiny' };`. Empty object literals do not require a space: `{}`.
 - Function definitions go at the top of their scope, followed immediately by `var`s.
 - If multiple lines are required for variable declarations, each new line should have its own `var` statement.
 - Indent using spaces.
 - Indentation width of 2.
 - No trailing whitespace.
 - Line-length limit of 80 characters.
 - If statements have to be broken across lines, end lines with an operator:
```javascript
// example
var reallyReallyReallyLongLine = 'Zero Cool' + ', Acid Burn' + ', Lord Nikon' +
    	', The Phantom Phreak' + ', Cereal Killer' + ', The Plague' +
    	', that other kid...';
```
 - Gulp will automatically lint everything through jshint. Don't make it complain.

## License
Licensed under [MIT](https://github.com/rileyjshaw/tinyterm/blob/master/LICENSE). Created by [rileyjshaw](http://rileyjshaw.com/).
