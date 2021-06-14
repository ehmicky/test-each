// Demo of the main usage.
// This file can be directly run:
//   - first install `test-each`
//   - then `node node_modules/test-each/examples/main.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/test-each

'use strict'

const assert = require('assert')

const { each } = require('test-each')

// The code we are testing
const multiply = require('./multiply.js')

// Repeat test using different inputs and expected outputs
each(
  [
    { first: 2, second: 2, output: 4 },
    { first: 3, second: 3, output: 9 },
  ],
  ({ title }, { first, second, output }) => {
    // Assertion titles will be:
    //    should multiply | {"first": 2, "second": 2, "output": 4}
    //    should multiply | {"first": 3, "second": 3, "output": 9}
    assert(multiply(first, second) === output, `should multiply | ${title}`)
  },
)
