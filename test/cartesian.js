import test from 'ava'

import testEach from '../src/main.js'

import { testSnapshots } from './helpers/snapshot.js'

testSnapshots('Normal iterations', [[['a']], [['a', 'b'], ['c', 'd']]])

testSnapshots('No arguments', [[]])

test('should return an iterable', t => {
  const iterable = testEach(['a'])
  t.is(typeof iterable[Symbol.iterator], 'function')
})
