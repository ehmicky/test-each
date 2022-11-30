import { testSnapshots } from '../helpers/snapshot.test.js'

testSnapshots('Truncating titles', [
  // eslint-disable-next-line no-magic-numbers
  [['a'.repeat(118)]],
  // eslint-disable-next-line no-magic-numbers
  [['a'.repeat(119)]],
])
