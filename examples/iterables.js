// Demo of `iterable()`.
// This file can be directly run:
//   - first install `test-each`
//   - then `node node_modules/test-each/examples/iterables.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/test-each

'use strict'

const { iterable } = require('test-each')

const combinations = iterable(
  ['green', 'red', 'blue'],
  [{ active: true }, { active: false }],
)

// eslint-disable-next-line fp/no-loops
for (const [{ title }, color, param] of combinations) {
  console.log(title, color, param)
}

const array = [
  ...iterable(['green', 'red', 'blue'], [{ active: true }, { active: false }]),
]

array.forEach(([{ title }, color, param]) => {
  console.log(title, color, param)
})
