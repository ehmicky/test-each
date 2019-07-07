import fastCartesian from 'fast-cartesian'

// Do a cartesian product between arrays, while remembering initial indexes
export const getCartesianLoops = function(arrays) {
  const arraysA = arrays.map(packParamIndexes)

  const loops = fastCartesian(...arraysA)

  const loopsA = loops.map(unpackParamIndexes)
  return loopsA
}

// Remember indexes in arrays, so we can retrieve it after cartesian product
const packParamIndexes = function(array) {
  return array.map(packParamIndex)
}

const packParamIndex = function(param, index) {
  return { index, param }
}

// Revert it after cartesian product
const unpackParamIndexes = function(loop, index) {
  const indexes = loop.map(unpackIndex)
  const params = loop.map(unpackParam)
  return { index, indexes, params }
}

const unpackIndex = function({ index }) {
  return index
}

const unpackParam = function({ param }) {
  return param
}
