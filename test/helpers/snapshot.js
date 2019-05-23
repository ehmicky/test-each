// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import prettyFormat from 'pretty-format'

import testEach from '../../src/main.js'

// For each `args` in `allArgs`, call `testEach(...args)` and snapshot the
// return value
export const testSnapshots = function(title, allArgs, { useCallback = true } = {}) {
  allArgs.forEach(args => snapshotArgs(args, title, useCallback))
}

const snapshotArgs = function(args, title, useCallback) {
  const titleA = `${title} | ${prettyFormat(args)}`
  test(titleA, t => {
    const loops = getLoops(args, useCallback)
    t.snapshot(loops)
  })
}

const getLoops = function(args, useCallback) {
  const callback = useCallback ? defaultCallback : undefined

  try {
    return testEach(...args, callback)
  } catch (error) {
    return String(error)
  }
}

const defaultCallback = function(...loopArgs) {
  return loopArgs
}
