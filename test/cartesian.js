import { testSnapshots } from './helpers/snapshot.js'

const generator = function* () {
  yield 'a'
  yield 'b'
}

testSnapshots('Normal iterations', [
  [['a']],
  [['a', 'b'], ['c', 'd']],
])

testSnapshots('No arguments', [
  [],
])

testSnapshots('Iterable arguments', [
  [new Map([[{}, 'a'], [{}, 'b']])],
  [new Set(['a', 'b'])],
  ['ab'],
  [generator()],
])

testSnapshots('Function parameters', [
  [[() => 'a']],
  [[(argA, argB, argC) => `${argB} ${argC}`], ['b'], ['c']],
])
