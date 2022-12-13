import { isRepeat } from './repeat.js'

// Parse and validate main input
export const parseInputs = (inputs) => {
  const inputsA = inputs.slice(0, -1)
  const callback = inputs[inputs.length - 1]

  validateInputs(inputsA)

  if (typeof callback !== 'function') {
    throw new TypeError('Last argument must be a function')
  }

  return [inputsA, callback]
}

export const validateInputs = (inputs) => {
  inputs.forEach(validateInput)
}

const validateInput = (input) => {
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
