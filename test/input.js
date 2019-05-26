import { testSnapshots } from './helpers/snapshot.js'

testSnapshots('Invalid iterable arguments', [
  [true],
  [-1],
  // eslint-disable-next-line no-magic-numbers
  [1.5],
  [NaN],
  [Infinity],
])

testSnapshots('Optional callback', [[], [['a']], [['a', 'b'], ['c', 'd']]], {
  useCallback: false,
})
