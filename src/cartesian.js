import { cartesianArray } from 'fast-cartesian'

// Do a cartesian product between arrays, while remembering initial indexes
export const getCartesianLoops = function(arrays) {
  const arraysA = arrays.map(packParams)

  const loops = cartesianArray(...arraysA)

  const loopsA = loops.map(unpackParams)
  return loopsA
}

// Remember indexes in arrays, so we can retrieve it after cartesian product
const packParams = function(array) {
  return array.map(packParam)
}

const packParam = function(paramTitle, index) {
  return { index, paramTitle }
}

// Revert it after cartesian product
const unpackParams = function(loop, index) {
  const indexes = loop.map(unpackIndex)
  const paramTitles = loop.map(unpackParamTitle)
  return { index, indexes, paramTitles }
}

const unpackIndex = function({ index }) {
  return index
}

const unpackParamTitle = function({ paramTitle }) {
  return paramTitle
}
