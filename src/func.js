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
  const paramsA = params
    .map(param => callFunc({ index, indexes, param, params }))
  return { index, indexes, params: paramsA }
}

const callFunc = function({ index, indexes, param, params }) {
  if (typeof param !== 'function') {
    return param
  }

  // `name` and `names` cannot be passed since they rely on the return value
  // of this function
  return param({ index, indexes }, ...params)
}
