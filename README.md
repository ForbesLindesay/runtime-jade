# runtime-jade

  Just the runtime part of jade.  If you compile jade templates at development time and then deploy the compiled source, you probably only need this module as a runtime dependency.  This is a **huge** win for download size.

  [![Build Status](https://travis-ci.org/ForbesLindesay/runtime-jade.png?branch=master)](https://travis-ci.org/ForbesLindesay/runtime-jade)
  [![Dependency Status](https://gemnasium.com/ForbesLindesay/runtime-jade.png)](https://gemnasium.com/ForbesLindesay/runtime-jade)
  [![NPM version](https://badge.fury.io/js/runtime-jade.png)](http://badge.fury.io/js/runtime-jade)

## Installation

    npm install runtime-jade

## API

### merge(a, b)

  Merge two attributes objects (`a` and `b`) giving precedence to values in the second (`b`) then return the first (`a`).

  Classes are special cased by being merged, rather than replaced, if they occur in both objects.

### attrs(attributes, escaped)

  Render the given attributes object to a string of html.  Escaped should contain a map of property names onto `true` if they need escaping or `false` if they do not need escaping.

### escape(str)

  Escape the given string and return an HTML safe string.

### rethrow(err, filename, lineno, [source])

  Attempt to add as much information as possible to an error message, before re-throwing it.

## License

  MIT