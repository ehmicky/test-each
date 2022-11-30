import test from 'ava'
import { each } from 'test-each'

import { testSnapshots } from './helpers/snapshot.test.js'

testSnapshots('Invalid inputs', [
  [undefined],
  [null],
  [true],
  [-1],
  // eslint-disable-next-line no-magic-numbers
  [1.5],
  [Number.NaN],
  [Number.POSITIVE_INFINITY],
])

test('Invalid callback | each()', (t) => {
  t.throws(() => each(['a']))
})
