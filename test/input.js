import test from 'ava'
// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import { each } from 'test-each'

import { testSnapshots } from './helpers/snapshot.js'

testSnapshots('Invalid inputs', [
  [undefined],
  // eslint-disable-next-line unicorn/no-null
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
