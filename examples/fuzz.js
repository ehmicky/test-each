// Demo of fuzz testing.
// This file can be directly run:
//   - first install `test-each`
//   - then `node node_modules/test-each/examples/fuzz.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/test-each

import assert from 'assert'

// eslint-disable-next-line node/no-missing-import
import { each } from 'test-each'

// The code we are testing
import { multiply } from './multiply.js'

// Fuzz testing. Run this test 1000 times using different numbers.
each(1000, Math.random, ({ title }, index, randomNumber) => {
  assert(
    multiply(randomNumber, 1) === randomNumber,
    `should correctly multiply floats | ${title}`,
  )
})
