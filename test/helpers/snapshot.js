// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import prettyFormat from 'pretty-format'

import testEach from '../../src/main.js'

// For each `args` in `allArgs`, call `testEach(...args)` and snapshot the
// return value
export const testSnapshots = function(title, allArgs) {
  allArgs.forEach(args => snapshotArgs(args, title))
}

const snapshotArgs = function(args, title) {
  const titleA = `${title} | ${prettyFormat(args)}`
  test(titleA, t => {
    const loops = getLoops(args)
    t.snapshot(loops)
  })
}

const getLoops = function(args) {
  try {
    return testEach(...args, (...loopArgs) => loopArgs)
  } catch (error) {
    return String(error)
  }
}
