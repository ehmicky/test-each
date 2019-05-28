// Demo of side effects.
// This file can be directly run:
//   - first install `test-each`
//   - then `node node_modules/test-each/examples/side_effects.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/test-each

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const testEach = require('test-each')

testEach(
  ['green', 'red', 'blue'],
  [{ active: true }, { active: false }],
  (info, color, param) => {
    // This should not be done, as the objects are re-used in several iterations
    param.active = !param.active
  },
)

// But this is safe since each iteration creates a new object
testEach(
  ['green', 'red', 'blue'],
  [() => ({ active: true }), () => ({ active: false })],
  (info, color, param) => {
    param.active = !param.active
  },
)
