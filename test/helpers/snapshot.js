import test from 'ava'
import prettyFormat from 'pretty-format'

import testEach from '../../src/main.js'

// For each `args` in `allArgs`, call `testEach(...args)` and snapshot the
// return value.
export const testSnapshots = function(
  testTitle,
  allArgs,
  { useCallback = true } = {},
) {
  allArgs.forEach(args => snapshotArgs(args, testTitle, useCallback))
}

// We don't use `testEach()` itself since we are testing it.
const snapshotArgs = function(args, testTitle, useCallback) {
  const title = prettyFormat(args, { min: true })
  test(`${testTitle} | ${title}`, t => {
    const loops = getLoops(args, useCallback)
    t.snapshot(loops)
  })
}

const getLoops = function(args, useCallback) {
  const callback = useCallback ? [defaultCallback] : []

  try {
    return testEach(...args, ...callback)
  } catch (error) {
    return error
  }
}

const defaultCallback = function(...loopArgs) {
  return loopArgs
}
