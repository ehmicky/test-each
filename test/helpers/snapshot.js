// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import prettyFormat from 'pretty-format'

import testEach from '../../src/main.js'

// For each `args` in `allArgs`, call `testEach(...args)` and snapshot the
// return value.
export const testSnapshots = function(testTitle, allArgs) {
  allArgs.forEach(args => snapshotArgs(args, testTitle))
}

// We don't use `testEach()` itself since we are testing it.
const snapshotArgs = function(args, testTitle) {
  const title = prettyFormat(args, { min: true })
  test(`${testTitle} | ${title}`, t => {
    const loops = getLoops(args)
    t.snapshot(loops)
  })
}

const getLoops = function(args) {
  try {
    const params = []
    testEach(...args, callback.bind(null, params))
    return params
  } catch (error) {
    return error
  }
}

const callback = function(params, ...args) {
  // eslint-disable-next-line fp/no-mutating-methods
  params.push(args)
}
