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

// `values` will be ['red 0', 'red 5', 'red 50', 'blue 0', 'blue 5', 'blue 50']
const values = testEach(
  ['red', 'blue'],
  [0, 5, 50],
  (info, color, number) => `${color} ${number}`,
)
console.log(values)

// If no `callback` is passed, iterations arguments will be returned as is.
const args = testEach(['red', 'blue'], [0, 5, 50])
args.forEach(([info, color, number]) => {
  console.log(info, color, number)
})
