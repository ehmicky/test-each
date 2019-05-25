import fastCartesian from './fast_cartesian.js'

// Do a cartesian product between iterables, while remembering initial indexes
export const getCartesianLoops = function(iterables) {
  const arrays = iterables.map(packParamIndexes)

  const loops = fastCartesian(...arrays)

  const loopsA = loops.map(unpackParamIndexes)
  return loopsA
}

// Remember indexes in iterables, so we can retrieve it after cartesian product
const packParamIndexes = function(iterable) {
  const array = Array.isArray(iterable) ? iterable : [...iterable]
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
