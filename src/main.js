import { cartesianIterate } from 'fast-cartesian'

import { parseInputs } from './input.js'
import { addRepeat } from './repeat.js'
import { normalizeFunc, callFuncs } from './func.js'
import { addTitles, joinTitles } from './title.js'
import { fixDuplicates } from './duplicate.js'
import { packParams, unpackParams } from './cartesian.js'

// Repeat a function with a combination of parameters.
// Meant for data-driven testing and fuzzy testing.
const testEach = function(...inputs) {
  const [inputsA, callback] = parseInputs(inputs)

  const arrays = inputsA.map(normalizeInput)

  // eslint-disable-next-line fp/no-let
  let index = -1

  // We iterate over each loop instead of calculating all loops in advance
  // in order to minimize memory cost and allow huge number of combinations.
  // eslint-disable-next-line fp/no-loops
  for (const loop of cartesianIterate(...arrays)) {
    // eslint-disable-next-line fp/no-mutation
    index += 1

    const loopA = unpackParams(loop, index)
    const loopB = callFuncs(loopA)
    const loopC = joinTitles(loopB)

    fireCallback(loopC, callback)
  }
}

const normalizeInput = function(input) {
  const inputA = addRepeat(input)
  const inputB = addTitles(inputA)
  const inputC = fixDuplicates(inputB)
  const inputD = normalizeFunc(inputC)
  const inputE = packParams(inputD)
  return inputE
}

// The `title`, `titles`, etc. are passed as first argument (not the last one)
// so that:
//  - user can put `params` in an array (if needs be) using variadic `...params`
//  - user can omit `params` if only the information in the first argument
//    is needed
// `callback` is optional and is a shortcut to `testEach(...).map(([...])=>{})`
// I.e. it behaves like `Array.map()`:
//  - more flexible and functional
//  - `Promise.all(results)` can be use used if `callback` is async
//  - user can retrieve `params`, `indexes`, etc. outside of `callback`
const fireCallback = function({ title, titles, index, indexes, params }, func) {
  return func({ title, titles, index, indexes }, ...params)
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = testEach
