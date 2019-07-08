import { testSnapshots } from './helpers/snapshot.js'

testSnapshots('Invalid inputs', [
  [undefined],
  [null],
  [true],
  [-1],
  // eslint-disable-next-line no-magic-numbers
  [1.5],
  [NaN],
  [Infinity],
])
