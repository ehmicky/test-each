// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { format } from 'pretty-format'
import safeJsonValue from 'safe-json-value'
import { each, iterable } from 'test-each'

// For each `args` in `allArgs`, call `each|iterable(...args)` and snapshot the
// return value.
export const testSnapshots = function (testTitle, allArgs, unsafe = false) {
  allArgs.forEach((args) => {
    snapshotMethod(args, testTitle, unsafe)
  })
}

// Run test for both `each()` and `iterable()`
const snapshotMethod = function (args, testTitle, unsafe) {
  METHODS.forEach(({ name, getParams }) => {
    snapshotArgs({ args, testTitle, name, getParams, unsafe })
  })
}

const METHODS = [
  {
    name: 'each()',
    getParams(args) {
      const allParams = []
      each(...args, (...params) => {
        // eslint-disable-next-line fp/no-mutating-methods
        allParams.push(params)
      })
      return allParams
    },
  },
  {
    name: 'iterable()',
    getParams(args) {
      return [...iterable(...args)]
    },
  },
]

// We don't use `test-each` itself since we are testing it.
const snapshotArgs = function ({ args, testTitle, name, getParams, unsafe }) {
  const title = unsafe ? '' : format(args, { min: true })
  test(`${testTitle} | ${name} ${title}`, (t) => {
    const loops = eGetParams(getParams, args)
    const loopsA = unsafe ? safeJsonValue(loops).value : loops
    t.snapshot(loopsA)
  })
}

const eGetParams = function (getParams, args) {
  try {
    return getParams(args)
  } catch (error) {
    return error
  }
}
