'use strict'

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class']
  var bc = b['class']

  if (ac || bc) {
    ac = ac || []
    bc = bc || []
    if (!Array.isArray(ac)) ac = [ac]
    if (!Array.isArray(bc)) bc = [bc]
    a['class'] = ac.concat(bc).filter(nulls)
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key]
    }
  }

  return a
}

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== ''
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 * @api private
 */

function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
  var terse = obj.terse

  delete obj.terse;
  var keys = Object.keys(obj)

  if (keys.length) {
    buf.push('')
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var val = obj[key]

      if ('boolean' == typeof val || null == val) {
        if (val) {
          if (terse) buf.push(key)
          else buf.push(key + '="' + key + '"')
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'")
      } else if ('class' == key) {
        if (escaped && escaped[key]){
          if (val = exports.escape(joinClasses(val))) {
            buf.push(key + '="' + val + '"')
          }
        } else {
          if (val = joinClasses(val)) {
            buf.push(key + '="' + val + '"')
          }
        }
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"')
      } else {
        buf.push(key + '="' + val + '"')
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @param {String} source
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, source){
  if (!(err instanceof Error)) throw err
  if ((typeof window != 'undefined' || !filename) && !source) {
    err.message += ' on line ' + lineno
    throw err
  }
  try {
    source =  source || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
  var lines = source.split('\n')
  var start = Math.max(lineno - context, 0)
  var end = Math.min(lines.length, lineno + context)

  // Error context
  var context = lines.slice(start, end).map(function (line, i) {
    var curr = i + start + 1
    return (curr == lineno ? '  > ' : '    ') + curr + '| ' + line;
  }).join('\n')

  // Alter exception message
  err.path = filename
  err.message = (filename || 'Jade') + ':' + lineno + '\n' + context + '\n\n' + err.message
  throw err
}
