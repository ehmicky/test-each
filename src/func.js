import { cartesianArray } from 'fast-cartesian'

import { getTitle } from './title.js'

// Inputs can be functions instead of arrays. We wrap those in an array
// before performing the cartesian product so they are multiplied, then we
// trigger each of them.
export const normalizeFunc = function(input) {
  if (typeof input !== 'function') {
    return input
  }

  return [{ param: wrapFunc(input) }]
}

// If an argument is a function, its return value will be used instead:
//  - this can be used to generate random input for example (fuzzy testing).
//  - it will be fired with all the arguments of this iteration. This allows
//    for arguments computed based on the value of other arguments.
// Closures that be used for stateful iterations:
//  - the state will be updated on each iteration, regardless of cartesian
//    dimensions.
//  - because of this, this is not documented as it leads to wrong usages.
//    Instead users can:
//     - if state should be repeated across cartesian dimentions, either:
//        - pre-compute array
//        - use `info.indexes` in input function
//     - otherwise, either:
//        - use `info.index` in input function
//        - use closures
export const callFuncs = function({ index, indexes, paramTitles }) {
  // `title` and `titles` cannot be passed since they rely on the return value
  // of this function
  const info = { index, indexes }
  const paramTitlesA = paramTitles.reduce(callFunc.bind(null, info), [])
  return { index, indexes, paramTitles: paramTitlesA }
}

// eslint-disable-next-line max-params
const callFunc = function(
  info,
  previous,
  { param, title },
  paramIndex,
  paramTitles,
) {
  if (!isInputFunc(param)) {
    return [...previous, { param, title }]
  }

  const func = unwrapFunc(param)

  // Return values from previous input functions can be used, but not next ones
  const nextParamTitles = paramTitles.slice(paramIndex)
  const params = [...previous, ...nextParamTitles].map(unwrapParamTitle)
  const paramA = func(info, ...params)

  const titleA = getTitle(paramA)

  return [...previous, { param: paramA, title: titleA }]
}

// Functions passed top-level are fired, but not functions passed inside arrays
// We wrap the first ones in order to differentiate.
const funcSymbol = Symbol('function')

const isInputFunc = function(param) {
  return (
    param !== undefined && param !== null && param[funcSymbol] !== undefined
  )
}

const wrapFunc = function(param) {
  return { [funcSymbol]: param }
}

const unwrapFunc = function(param) {
  return param[funcSymbol]
}

const unwrapParamTitle = function({ param }) {
  if (isInputFunc(param)) {
    return unwrapFunc(param)
  }

  return param
}
