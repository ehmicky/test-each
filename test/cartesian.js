import test from 'ava'
import isCi from 'is-ci'

import { each } from '../src/main.js'

import { testSnapshots } from './helpers/snapshot.js'

testSnapshots('Normal iterations', [[['a']], [['a', 'b'], ['c', 'd']]])

testSnapshots('No arguments', [[]])

// This test is very slow, so it is run only in CI
const ciTest = isCi ? test : test.skip

const inputs = Array.from({ length: 24 }, () => [0, 1])

// eslint-disable-next-line no-empty-function
const identifyFunc = () => {}

ciTest('should not crash when combinations are huge | each()', t => {
  t.notThrows(() => each(...inputs, identifyFunc))
})
