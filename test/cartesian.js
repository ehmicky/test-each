import { testSnapshots } from './helpers/snapshot.js'

const generator = function*() {
  yield 'a'
  yield 'b'
}

const getIndex = function({ index }) {
  return index
}

const getIndexes = function({ indexes }) {
  return indexes
}

testSnapshots('Normal iterations', [[['a']], [['a', 'b'], ['c', 'd']]])

testSnapshots('No arguments', [[]])

testSnapshots('Iterable arguments', [
  [new Map([[{}, 'a'], [{}, 'b']])],
  [new Set(['a', 'b'])],
  ['ab'],
  [generator()],
])

testSnapshots('Function parameters', [
  [[() => 'a']],
  // eslint-disable-next-line max-params
  [[(info, argA, argB, argC) => `${argB} ${argC}`], ['b'], ['c']],
  [[getIndex], ['a', 'b'], ['c', 'd']],
  [[getIndexes], ['a', 'b'], ['c', 'd']],
])
