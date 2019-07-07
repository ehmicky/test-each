import { isRepeat } from './repeat.js'

// Parse and validate main input
export const parseInputs = function(inputs) {
  const [inputsA, callback] = splitInputs(inputs)
  inputsA.forEach(validateInput)
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

const validateInput = function(input) {
  if (
    !Array.isArray(input) &&
    !isRepeat(input) &&
    typeof input !== 'function'
  ) {
    throw new TypeError(
      `Argument must be an array, a positive integer or a function: ${input}`,
    )
  }
}
