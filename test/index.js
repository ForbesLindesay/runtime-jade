'use strict'

var assert = require('assert')
var parseDOM = require('htmlparser2').parseDOM
var jade = require('../')

describe('merge', function () {
  it('merges two objects', function () {
    assert.deepEqual(jade.merge({a: 10, b: 20}, {c: 30, d: 40}), {a: 10, b: 20, c: 30, d: 40})
  })
  it('gives priority to the second argument', function () {
    assert.deepEqual(jade.merge({a: 10, b: 20}, {a: 30, b: 40}), {a: 30, b: 40})
  })
  it('handles classes', function () {
    assert.deepEqual(jade.merge({class: 'foo'}, {class: ['bar', 'baz']}), {class: ['foo', 'bar', 'baz']})
    assert.deepEqual(jade.merge({class: ['foo']}, {class: ['bar', 'baz']}), {class: ['foo', 'bar', 'baz']})
    assert.deepEqual(jade.merge({class: ['foo', 'bar']}, {class: ['baz']}), {class: ['foo', 'bar', 'baz']})
    assert.deepEqual(jade.merge({class: ['foo', 'bar']}, {class: 'baz'}), {class: ['foo', 'bar', 'baz']})
  })
})

describe('attrs', function () {
  function check(input, escaped, expected) {
    assert.deepEqual(parseDOM('<div ' + jade.attrs(input, escaped) + '></div>')[0].attribs, expected)
  }
  it('handles simple strings and unescaped attributes', function () {
    check({
      foo: 'bar',
      baz: '<bash>',
      danger: '<bash>'
    }, {
      foo: true,
      baz: true,
      danger: false
    }, {
      foo: 'bar',
      baz: '&lt;bash&gt;',
      danger: '<bash>'
    })
  })
  it('handles class serialization', function () {
    check({
      class: ['foo', 'bar', 'baz']
    }, {
      class: true
    }, {
      class: 'foo bar baz'
    })
    check({
      class: ['foo', '<bar>', 'baz']
    }, {
      class: true
    }, {
      class: 'foo &lt;bar&gt; baz'
    })
    check({
      class: ['foo', '<bar>', 'baz']
    }, {
      class: false
    }, {
      class: 'foo <bar> baz'
    })
  })
})

describe('escape', function () {
  it('replaces & with &amp;', function () {
    assert.equal(jade.escape('&'), '&amp;')
  })
  it('replaces > with &gt;', function () {
    assert.equal(jade.escape('>'), '&gt;')
  })
  it('replaces < with &lt;', function () {
    assert.equal(jade.escape('<'), '&lt;')
  })
  it('replaces " with &quot;', function () {
    assert.equal(jade.escape('"'), '&quot;')
  })
})

describe('rethrow', function () {
  describe('if the error is not an `Error`', function () {
    it('passes the error through', function () {
      var sentinel = {}
      try {
        jade.rethrow(sentinel, 'file.jade', 10, 'imaginary jade source')
      } catch (ex) {
        assert(sentinel === ex)
        assert.deepEqual(ex, {})
        return
      }
      throw new Error('an error should be thrown')
    })
  })
  describe('if there is no filename and no source text provided', function () {
    it('adds a line number to the error', function () {
      var sentinel = new Error('test')
      try {
        jade.rethrow(sentinel, null, 10, null)
      } catch (ex) {
        assert(sentinel === ex)
        assert(ex.message === 'test on line 10')
        return
      }
      throw new Error('an error should be thrown')
    })
  })
})