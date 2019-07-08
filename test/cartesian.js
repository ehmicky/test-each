import test from 'ava'

import testEach from '../src/main.js'

import { testSnapshots } from './helpers/snapshot.js'

testSnapshots('Normal iterations', [[['a']], [['a', 'b'], ['c', 'd']]])

testSnapshots('No arguments', [[]])

test('should not crash when combinations are huge', t => {
  const inputs = Array.from({ length: 24 }, () => [0, 1])

  // eslint-disable-next-line no-empty-function, max-nested-callbacks
  t.notThrows(() => testEach(...inputs, () => {}))
})
