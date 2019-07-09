import { cartesianIterate } from 'fast-cartesian'

import { parseInputs, validateInputs } from './input.js'
import { addRepeat } from './repeat.js'
import { normalizeFunc, callFuncs } from './func.js'
import { addTitles, joinTitles } from './title.js'
import { fixDuplicates } from './duplicate.js'
import { wrapIndexes, unwrapIndexes } from './indexes.js'

// Repeat a function with a combination of parameters.
// Meant for data-driven testing and fuzzy testing.
// Pass each combination to the final callback.
export const each = function(...inputs) {
  const [inputsA, func] = parseInputs(inputs)

  const inputsB = inputsA.map(normalizeInput)

  // eslint-disable-next-line fp/no-loops
  for (const [info, values] of forEachLoop(inputsB)) {
    // The `title`, `titles`, etc. are passed as first argument (not the last
    // one) so that:
    //  - user can put `params` in an array (if needs be) using variadic
    //    `...params`
    //  - user can omit `params` if only the information in the first argument
    //    is needed
    func(info, ...values)
  }
}

// Same but returns an iterable
export const iterable = function*(...inputs) {
  validateInputs(inputs)

  const inputsA = inputs.map(normalizeInput)

  yield* forEachLoop(inputsA)
}

const normalizeInput = function(input) {
  const inputA = addRepeat(input)
  const inputB = addTitles(inputA)
  const inputC = fixDuplicates(inputB)
  const inputD = normalizeFunc(inputC)
  const inputE = wrapIndexes(inputD)
  return inputE
}

// We iterate over each loop instead of calculating all loops in advance
// in order to minimize memory cost and allow huge number of combinations.
// For the same reason, `each()` does not return anything.
const forEachLoop = function*(inputs) {
  // eslint-disable-next-line fp/no-let
  let index = -1

  // eslint-disable-next-line fp/no-loops
  for (const loop of cartesianIterate(...inputs)) {
    // eslint-disable-next-line fp/no-mutation
    index += 1

    const { values, ...info } = normalizeLoop(loop, index)
    yield [info, values]
  }
}

const normalizeLoop = function(loop, index) {
  const loopA = unwrapIndexes(loop, index)
  const loopB = callFuncs(loopA)
  const loopC = joinTitles(loopB)
  return loopC
}
