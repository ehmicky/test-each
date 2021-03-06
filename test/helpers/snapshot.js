// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import prettyFormat from 'pretty-format'

import { each, iterable } from '../../src/main.js'

// For each `args` in `allArgs`, call `each|iterable(...args)` and snapshot the
// return value.
export const testSnapshots = function (testTitle, allArgs) {
  allArgs.forEach((args) => {
    snapshotMethod(args, testTitle)
  })
}

// Run test for both `each()` and `iterable()`
const snapshotMethod = function (args, testTitle) {
  METHODS.forEach(({ name, getParams }) => {
    snapshotArgs({ args, testTitle, name, getParams })
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
const snapshotArgs = function ({ args, testTitle, name, getParams }) {
  const title = prettyFormat(args, { min: true })
  test(`${testTitle} | ${name} ${title}`, (t) => {
    const loops = eGetParams(getParams, args)
    t.snapshot(loops)
  })
}

const eGetParams = function (getParams, args) {
  try {
    return getParams(args)
  } catch (error) {
    return error
  }
}
