import { parseInputs } from './input.js'
import { addRepeat } from './repeat.js'
import { getCartesianLoops } from './cartesian.js'
import { normalizeFunc, callFuncs } from './func.js'
import { addTitles, joinTitles } from './title.js'
import { fixDuplicates } from './duplicate.js'

// Repeat a function with a combination of parameters.
// Meant for data-driven testing and fuzzy testing.
const testEach = function(...inputs) {
  const [inputsA, callback] = parseInputs(inputs)

  const inputsB = inputsA.map(addRepeat)
  const inputsC = inputsB.map(addTitles)
  const inputsD = inputsC.map(fixDuplicates)
  const arrays = inputsD.map(normalizeFunc)

  const loops = getCartesianLoops(arrays)

  const loopsA = loops.map(callFuncs)
  const loopsB = loopsA.map(joinTitles)

  const results = loopsB.map(loop => fireCallback(loop, callback))
  return results
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
