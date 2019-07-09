// Demo of side effects.
// This file can be directly run:
//   - first install `test-each`
//   - then `node node_modules/test-each/examples/side_effects.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/test-each

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const { each } = require('test-each')

/* eslint-disable fp/no-mutation */
each(
  ['green', 'red', 'blue'],
  [{ active: true }, { active: false }],
  (info, color, param) => {
    // This should not be done, as the objects are re-used in several iterations
    // param.active = false

    // But this is safe since it's a copy
    const newParam = { ...param }
    newParam.active = false
  },
)
/* eslint-enable fp/no-mutation */
