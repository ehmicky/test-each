// Inputs can be functions instead of arrays. We wrap those in an array
// before performing the cartesian product so they are multiplied, then we
// trigger each of them.
export const normalizeFunc = function(input) {
  if (typeof input !== 'function') {
    return input
  }

  const value = wrapFunc(input)
  return [{ value }]
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
export const callFuncs = function({ index, indexes, values, titles }) {
  // `title` and `titles` cannot be passed since they rely on the return value
  // of this function
  const info = { index, indexes }
  const valuesA = values.reduce(callFunc.bind(null, info), [])

  // Remember which values were input functions before calling them,
  // so that their titles can be generated later.
  const inputFuncs = values.map(isInputFunc)

  return { index, indexes, values: valuesA, inputFuncs, titles }
}

// eslint-disable-next-line max-params
const callFunc = function(info, previous, value, valueIndex, values) {
  if (!isInputFunc(value)) {
    return [...previous, value]
  }

  const func = unwrapFunc(value)

  // Return values from previous input functions can be used, but not next ones
  const nextValues = values.slice(valueIndex).map(unwrapValue)
  const valueA = func(info, ...previous, ...nextValues)

  return [...previous, valueA]
}

// Functions passed top-level are fired, but not functions passed inside arrays
// We wrap the first ones in order to differentiate.
const funcSymbol = Symbol('function')

const isInputFunc = function(value) {
  return (
    value !== undefined && value !== null && value[funcSymbol] !== undefined
  )
}

const wrapFunc = function(value) {
  return { [funcSymbol]: value }
}

const unwrapFunc = function(value) {
  return value[funcSymbol]
}

const unwrapValue = function(value) {
  if (isInputFunc(value)) {
    return unwrapFunc(value)
  }

  return value
}
