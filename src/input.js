import { isRepeat } from './repeat.js'

// Parse and validate main input
export const parseInputs = function(inputs) {
  const [inputsA, callback] = splitInputs(inputs)
  inputsA.forEach(validateArg)
  return [inputsA, callback]
}

const splitInputs = function(inputs) {
  const lastInput = inputs[inputs.length - 1]

  if (typeof lastInput !== 'function') {
    return [inputs, defaultCallback]
  }

  return [inputs.slice(0, -1), lastInput]
}

// `callback` is optional and defaults to returning arguments as is
const defaultCallback = function(info, ...params) {
  return [info, ...params]
}

const validateArg = function(input) {
  if (!isIterable(input) && !isRepeat(input) && typeof input !== 'function') {
    throw new TypeError(
      `Argument must be an iterable, a positive integer or a function: ${input}`,
    )
  }
}

const isIterable = function(input) {
  return (
    input !== undefined &&
    input !== null &&
    input[Symbol.iterator] !== undefined
  )
}
