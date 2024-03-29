// Demo of input functions.
// This file can be directly run:
//   - first install `test-each`
//   - then `node node_modules/test-each/examples/functions.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/test-each

import { each } from 'test-each'

// Run callback with a different random number each time
each(['red', 'green', 'blue'], Math.random, (info, color, randomNumber) => {
  console.log(color, randomNumber)
})

// Input functions are called with the same arguments as the callback
/* eslint-disable max-params */
each(
  ['02', '15', '30'],
  ['January', 'February', 'March'],
  ['1980', '1981'],
  (info, day, month, year) => `${day}/${month}/${year}`,
  (info, day, month, year, date) => {
    console.log(date)
  },
)
/* eslint-enable max-params */
