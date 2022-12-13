import { testSnapshots } from './helpers/snapshot.test.js'

const getIndex = ({ index }) => index

const getIndexes = ({ indexes }) => indexes

const getTrue = () => true

// eslint-disable-next-line max-params
const concatArgs = (info, argA, argB, argC) => [argA, argB, argC]

testSnapshots('Function parameters', [
  [() => 'a'],
  // eslint-disable-next-line max-params
  [(info, argA, argB, argC) => `${argB} ${argC}`, ['b'], ['c']],
  [getTrue, concatArgs, getTrue],
  [getIndex, ['a', 'b'], ['c', 'd']],
  [getIndexes, ['a', 'b'], ['c', 'd']],
  [[getTrue]],
])
