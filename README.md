# runtime-jade

  Just the runtime part of jade.  If you compile jade templates at development time and then deploy the compiled source, you probably only need this module as a runtime dependency.  This is a **huge** win for download size.

  [![Build Status](https://img.shields.io/travis/ForbesLindesay/runtime-jade/master.svg)](https://travis-ci.org/ForbesLindesay/runtime-jade)
  [![Dependency Status](https://img.shields.io/gemnasium/ForbesLindesay/runtime-jade.svg)](https://gemnasium.com/ForbesLindesay/runtime-jade)
  [![NPM version](https://img.shields.io/npm/v/runtime-jade.svg)](http://badge.fury.io/js/runtime-jade)

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