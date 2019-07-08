import { cartesianIterate } from 'fast-cartesian'

import { parseInputs } from './input.js'
import { addRepeat } from './repeat.js'
import { normalizeFunc, callFuncs } from './func.js'
import { addTitles, joinTitles } from './title.js'
import { fixDuplicates } from './duplicate.js'
import { packParams, unpackParams } from './cartesian.js'

// Repeat a function with a combination of parameters.
// Meant for data-driven testing and fuzzy testing.
// eslint-disable-next-line max-statements
const testEach = function(...inputs) {
  const [inputsA, callback] = parseInputs(inputs)

  const inputsB = inputsA.map(addRepeat)
  const inputsC = inputsB.map(addTitles)
  const inputsD = inputsC.map(fixDuplicates)
  const arrays = inputsD.map(normalizeFunc)
  const arraysA = arrays.map(packParams)

  // eslint-disable-next-line fp/no-let
  let index = -1

  // eslint-disable-next-line fp/no-loops
  for (const loop of cartesianIterate(...arraysA)) {
    // eslint-disable-next-line fp/no-mutation
    index += 1

    const loopA = unpackParams(loop, index)
    const loopB = callFuncs(loopA)
    const loopC = joinTitles(loopB)

    fireCallback(loopC, callback)
  }
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
