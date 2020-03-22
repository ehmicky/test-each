import { testSnapshots } from './helpers/snapshot.js'

testSnapshots('`title` property', [
  [[{ title: 'a' }]],
  [[{ title: '' }]],
  [[{ title: ' ' }]],
  [[{ title: true }]],
])

testSnapshots('Truncating titles', [
  // eslint-disable-next-line no-magic-numbers
  [['a'.repeat(118)]],
  // eslint-disable-next-line no-magic-numbers
  [['a'.repeat(119)]],
])

const getNamedFunction = function () {
  // eslint-disable-next-line no-empty-function
  return function func() {}
}

const getAnonymousFunction = function () {
  // eslint-disable-next-line no-empty-function, func-names
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
  [['a\r\nb\r\nc']],
  [['a\fb\fc']],
  [['a\vb\vc']],

  // Keys should be sorted
  [[{ argB: true, argA: true, [Symbol('arg')]: true }]],

  // Serialiazing circular references
  [[self]],

  // Titles of objects with `toJSON()`
  [[{ toJSON: () => 'toJSON result' }]],

  // Serializing deep objects
  [[{ argA: { argB: { argC: true } } }]],

  // Serializing ANSI sequences
  [['\u001B[31mtext\u001B[39m']],
])
