// Inputs can be functions instead of arrays. We wrap those in an array
// before performing the cartesian product so they are multiplied, then we
// trigger each of them.
export const normalizeFunc = function(input) {
  if (typeof input !== 'function') {
    return input
  }

  const param = wrapFunc(input)
  return [{ param }]
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
export const callFuncs = function({ index, indexes, params, titles }) {
  // `title` and `titles` cannot be passed since they rely on the return value
  // of this function
  const info = { index, indexes }
  const paramsA = params.reduce(callFunc.bind(null, info), [])

  // Remember which parameters were input functions before calling them,
  // so that their titles can be generated later.
  const funcParams = params.map(isInputFunc)

  return { index, indexes, params: paramsA, funcParams, titles }
}

// eslint-disable-next-line max-params
const callFunc = function(info, previous, param, paramIndex, params) {
  if (!isInputFunc(param)) {
    return [...previous, param]
  }

  const func = unwrapFunc(param)

  // Return values from previous input functions can be used, but not next ones
  const nextParams = params.slice(paramIndex).map(unwrapParam)
  const paramA = func(info, ...previous, ...nextParams)

  return [...previous, paramA]
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

const unwrapParam = function(param) {
  if (isInputFunc(param)) {
    return unwrapFunc(param)
  }

  return param
}
