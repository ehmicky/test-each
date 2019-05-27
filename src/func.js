// If a parameter is a function, its return value will be used instead:
//  - this can be used to generate random input for example (fuzzy testing).
//  - it will be fired with all the arguments of this iteration. This allows
//    for arguments computed based on the value of other arguments.
// Closures that be used for stateful iterations:
//  - the state will be updated on each iteration, regardless of cartesian
//    dimensions.
//  - because of this, this is not documented as it leads to wrong usages.
//    Instead users can:
//     - if state should be repeated across cartesian dimentions, either:
//        - pre-compute iterable, or use a generator
//        - use `info.indexes` in input function
//     - otherwise, either:
//        - use `info.index` in input function
//        - use closures
export const callFuncs = function({ index, indexes, params }) {
  // `title` and `titles` cannot be passed since they rely on the return value
  // of this function
  const info = { index, indexes }
  const paramsA = params.reduce(callFunc.bind(null, info), [])
  return { index, indexes, params: paramsA }
}

// eslint-disable-next-line max-params
const callFunc = function(info, previous, param, paramIndex, params) {
  if (typeof param !== 'function') {
    return [...previous, param]
  }

  // Return values from previous input functions can be used, but not next ones
  const paramA = param(info, ...previous, ...params.slice(paramIndex))
  return [...previous, paramA]
}
