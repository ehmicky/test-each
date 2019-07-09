// Demo of test titles.
// This file can be directly run:
//   - first install `test-each`
//   - then `node node_modules/test-each/examples/title.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/test-each

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const { each } = require('test-each')

each([{ color: 'red' }, { color: 'blue' }], ({ title }) => {
  // Titles will be:
  //    should test color | {"color": "red"}
  //    should test color | {"color": "blue"}
  console.log(`should test color | ${title}`)
})

// Plain objects can override this using a `title` property
each(
  [{ color: 'red', title: 'Red' }, { color: 'blue', title: 'Blue' }],
  ({ title }) => {
    // Titles will be:
    //    should test color | Red
    //    should test color | Blue
    console.log(`should test color | ${title}`)
  },
)

// The `info` argument can be used for dynamic titles
each([{ color: 'red' }, { color: 'blue' }], (info, param) => {
  // Test titles will be:
  //    should test color | 0 red
  //    should test color | 1 blue
  console.log(`should test color | ${info.index} ${param.color}`)
})
