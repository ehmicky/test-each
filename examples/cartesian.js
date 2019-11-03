// Demo of cartesian products.
// This file can be directly run:
//   - first install `test-each`
//   - then `node node_modules/test-each/examples/cartesian.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/test-each

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const assert = require('assert')

const { each } = require('test-each')

// The code we are testing
const multiply = require('./multiply.js')

// Cartesian product.
// Run this test 4 times using every possible combination of inputs
each([0.5, 10], [2.5, 5], ({ title }, first, second) => {
  assert(
    typeof multiply(first, second) === 'number',
    `should mix integers and floats | ${title}`,
  )
})

// Run callback five times: a -> b -> c -> d -> e
each(['a', 'b', 'c', 'd', 'e'], (info, param) => {
  console.log(param)
})

// Run callback six times: a c -> a d -> a e -> b c -> b d -> b e
each(['a', 'b'], ['c', 'd', 'e'], (info, param, otherParam) => {
  console.log(param, otherParam)
})

// Nested arrays are not iterated.
// This runs callback twice with an array `param`: ['a', 'b'] -> ['c', 'd', 'e']
each(
  [
    ['a', 'b'],
    ['c', 'd', 'e'],
  ],
  (info, param) => {
    console.log(param)
  },
)
