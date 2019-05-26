import { parseInput } from './input.js'
import { addRepeat } from './repeat.js'
import { getCartesianLoops } from './cartesian.js'
import { callFuncs } from './func.js'
import { addNames } from './name.js'
import { fixDuplicate } from './duplicate.js'

// Repeat a function with a combination of parameters.
// Meant for data-driven testing and fuzzy testing.
const testEach = function(...args) {
  const { iterables, callback } = parseInput(args)

  const iterablesA = iterables.map(addRepeat)

  const loops = getCartesianLoops(iterablesA)

  const loopsA = loops.map(callFuncs)
  const loopsB = loopsA.map(addNames)
  const loopsC = loopsB.map(fixDuplicate)

  const results = loopsC.map(loop => fireCallback(loop, callback))
  return results
}

// The `name`, `names`, etc. are passed as first argument (not the last one)
// so that:
//  - user can put `params` in an array (if needs be) using variadic `...params`
//  - user can omit `params` if only the information in the first argument
//    is needed
// `callback` is optional and is a shortcut to `testEach(...).map(([...])=>{})`
// I.e. it behaves like `Array.map()`:
//  - more flexible and functional
//  - `Promise.all(results)` can be use used if `callback` is async
//  - user can retrieve `params`, `indexes`, etc. outside of `callback`
const fireCallback = function({ name, names, index, indexes, params }, func) {
  return func({ name, names, index, indexes }, ...params)
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = testEach
