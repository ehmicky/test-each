import { testSnapshots } from './helpers/snapshot.js'

const getIndex = function ({ index }) {
  return index
}

const getIndexes = function ({ indexes }) {
  return indexes
}

const getTrue = function () {
  return true
}

// eslint-disable-next-line max-params
const concatArgs = function (info, argA, argB, argC) {
  return [argA, argB, argC]
}

testSnapshots('Function parameters', [
  [() => 'a'],
  // eslint-disable-next-line max-params
  [(info, argA, argB, argC) => `${argB} ${argC}`, ['b'], ['c']],
  [getTrue, concatArgs, getTrue],
  [getIndex, ['a', 'b'], ['c', 'd']],
  [getIndexes, ['a', 'b'], ['c', 'd']],
  [[getTrue]],
])
