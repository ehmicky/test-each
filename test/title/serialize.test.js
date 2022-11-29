import { testSnapshots } from '../helpers/snapshot.js'

const getNamedFunction = function () {
  return function func() {}
}

const getAnonymousFunction = function () {
  // eslint-disable-next-line func-names
  return function () {}
}

const self = {}
// eslint-disable-next-line fp/no-mutation
self.self = self

// eslint-disable-next-line fp/no-class
class Custom {}

testSnapshots('Titles serialization', [
  [[true]],
  [[null]],
  [[undefined]],
  // eslint-disable-next-line no-magic-numbers
  [[3e8]],
  [[-0]],
  [[Number.NEGATIVE_INFINITY]],
  [[Number.NaN]],
  [[Symbol('a')]],
  [[getNamedFunction]],
  [[getAnonymousFunction]],
  [[new Date(0)]],
  [[new Date(Number.NaN)]],
  [[new Error('message')]],
  [[/regexp/u]],
  [[['a', 'b']]],
  [[new ArrayBuffer(2)]],
  [[new Custom()]],
  [
    [
      new Map([
        [{}, 'a'],
        [{}, 'b'],
      ]),
    ],
  ],
  [[new Set(['a', 'b'])]],
  [
    [
      new WeakMap([
        [{}, 'a'],
        [{}, 'b'],
      ]),
    ],
  ],
  [[new WeakSet([{}])]],

  // Newlines
  [['a\nb\nc']],
  [['a\r\nb\r\nd']],
  [['a\fb\fe']],
  [['a\vb\vf']],

  // Keys should be sorted
  [[{ argB: true, argA: true, [Symbol('arg')]: true }]],

  // Serializing circular references
  [[self]],

  // Titles of objects with `toJSON()`
  [[{ toJSON: () => 'toJSON result' }]],

  // Serializing deep objects
  [[{ argA: { argB: { argC: true } } }]],

  // Serializing long arrays
  [[[1, 1, 1, 1, 1, 1]]],

  // Serializing ANSI sequences
  [['\u001B[31mtext\u001B[39m']],
])
