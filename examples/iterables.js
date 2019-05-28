// Demo of iterables.
// This file can be directly run:
//   - first install `test-each`
//   - then `node node_modules/test-each/examples/iterables.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/test-each

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const assert = require('assert')

const testEach = require('test-each')

// The code we are testing
const multiply = require('./multiply.js')

// Works with any iterable. Run this test 10 times using each digit.
testEach('012345679', ({ title }, digit) => {
  assert(
    multiply(digit, 1) === Number(digit),
    `should allow stringified numbers | ${title}`,
  )
})

// Run callback five times: a -> b -> c -> d -> e
testEach('abcde', (info, param) => {
  console.log(param)
})
