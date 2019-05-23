import { testSnapshots } from './helpers/snapshot.js'

const generator = function* () {
  yield 'a'
  yield 'b'
}

const getNamedFunction = function() {
  // eslint-disable-next-line no-empty-function
  return function func() {}
}

const getAnonymousFunction = function() {
  // eslint-disable-next-line no-empty-function, func-names
  return function() {}
}

const self = {}
// eslint-disable-next-line fp/no-mutation
self.self = self

// eslint-disable-next-line fp/no-class
class Custom {}

// TODO: last argument not being a function

testSnapshots('dummy', [
  // Invalid inputs
  [true],
  [-1],
  // eslint-disable-next-line no-magic-numbers
  [1.5],
  [NaN],
  [Infinity],

  // Normal iterations
  [['a']],
  [['a', 'b'], ['c', 'd']],

  // No arguments
  [],

  // Number arguments
  [['a'], 2],
  [['a'], 0],

  // Iterable arguments
  [new Map([[{}, 'a'], [{}, 'b']])],
  [new Set(['a', 'b'])],
  ['ab'],
  [generator()],

  // Function parameters
  [[() => 'a']],
  [[(argA, argB, argC) => `${argB} ${argC}`], ['b'], ['c']],

  // `name` property
  [[{name: 'a'}]],
  [[{name: ''}]],
  [[{name: ' '}]],
  [[{name: true}]],

  // Duplicate names
  [['a', 'a', 'b'], ['c', 'd']],

  // Truncating names
  // eslint-disable-next-line no-magic-numbers
  [['a'.repeat(118)]],
  // eslint-disable-next-line no-magic-numbers
  [['a'.repeat(119)]],

  // Names serialization for each possible type
  [[true]],
  [[null]],
  [[undefined]],
  // eslint-disable-next-line no-magic-numbers
  [[3e8]],
  [[-0]],
  [[-Infinity]],
  [[NaN]],
  [[Symbol('a')]],
  [[getNamedFunction]],
  [[getAnonymousFunction]],
  [[new Date(0)]],
  [[new Date(NaN)]],
  [[new Error('message')]],
  [[/regexp/u]],
  [[['a', 'b']]],
  [[new ArrayBuffer(2)]],
  // Keys should be sorted
  [[{argB: true, argA: true, [Symbol('arg')]: true}]],
  [[new Custom()]],
  [[new Map([[{}, 'a'], [{}, 'b']])]],
  [[new Set(['a', 'b'])]],
  [[new WeakMap([[{}, 'a'], [{}, 'b']])]],
  [[new WeakSet([{}])]],
  // Serialiazing circular references
  [[self]],
  // Names of objects with `toJSON()`
  [[{ toJSON: () => 'toJSON result' }]],
  // Serializing deep objects
  [[{argA:{argB:{argC: true}}}]],
  // Serializing ANSI sequences
  [['\u001B[31mtext\u001B[39m']],
])
