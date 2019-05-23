import { testSnapshots } from './helpers/snapshot.js'

testSnapshots('Duplicate names', [
  [['a', 'a', 'b'], ['c', 'd']],
])
