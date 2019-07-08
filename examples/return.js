// Demo of return values.
// This file can be directly run:
//   - first install `test-each`
//   - then `node node_modules/test-each/examples/return.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/test-each

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const testEach = require('test-each')

const iterable = testEach(
  ['red', 'blue'],
  [0, 5, 50],
  (info, color, number) => `${color} ${number}`,
)

// eslint-disable-next-line fp/no-loops
for (const value of iterable) {
  console.log(value)
}
// 'red 0'
// 'red 5'
// 'red 50'
// 'blue 0'
// 'blue 5'
// 'blue 50'

// If no `callback` is passed, this iterates over each callback arguments.
const otherIterable = testEach(['red', 'blue'], [0, 5, 50])

// eslint-disable-next-line fp/no-loops
for (const [, color, number] of otherIterable) {
  console.log(color, number)
}
// 'red' 0
// 'red' 5
// 'red' 50
// 'blue' 0
// 'blue' 5
// 'blue' 50
