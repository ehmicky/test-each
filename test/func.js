import { testSnapshots } from './helpers/snapshot.js'

const getIndex = function({ index }) {
  return index
}

const getIndexes = function({ indexes }) {
  return indexes
}

testSnapshots('Function parameters', [
  [[() => 'a']],
  // eslint-disable-next-line max-params
  [[(info, argA, argB, argC) => `${argB} ${argC}`], ['b'], ['c']],
  [[getIndex], ['a', 'b'], ['c', 'd']],
  [[getIndexes], ['a', 'b'], ['c', 'd']],
])
