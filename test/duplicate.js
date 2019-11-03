import { testSnapshots } from './helpers/snapshot.js'

testSnapshots('Duplicate titles', [
  [
    ['a', 'b', 'a'],
    ['c', 'd'],
  ],
])
