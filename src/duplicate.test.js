import { testSnapshots } from './helpers/snapshot.test.js'

testSnapshots('Duplicate titles', [
  [
    ['a', 'b', 'a'],
    ['c', 'd'],
  ],
  [[' ', '  ']],
  [['a\t', 'a ']],
])
