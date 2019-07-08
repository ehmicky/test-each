import { isRepeat } from './repeat.js'

// Parse and validate main input
export const parseInputs = function(inputs) {
  const inputsA = inputs.slice(0, -1)
  const callback = inputs[inputs.length - 1]

  inputsA.forEach(validateInput)

  if (typeof callback !== 'function') {
    throw new TypeError('Last argument must be a function')
  }

  return [inputsA, callback]
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
