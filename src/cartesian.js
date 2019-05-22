import { fastCartesian } from './fast_cartesian.js'

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

// Invert it after cartesian product
const unpackParamIndexes = function(loop, index) {
  const indexes = loop.map(unpackIndex)
  const params = loop.map(unpackParam).map(invokeFunc)
  return { index, indexes, params }
}

const unpackIndex = function({ index }) {
  return index
}

const unpackParam = function({ param }) {
  return param
}

// If a parameter is a function, its return value will be used instead.
// This can be used to generate random input for example (fuzzy testing).
// It will be fired with all the arguments of this iteration. This allows for
// arguments to be computed based on the value of other arguments.
const invokeFunc = function(param, index, params) {
  if (typeof param !== 'function') {
    return param
  }

  return param(...params)
}
