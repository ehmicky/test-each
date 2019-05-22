import { parseInput } from './input.js'
import { addRepeat } from './repeat.js'
import { getCartesianLoops } from './cartesian.js'
import { addNames } from './name.js'
import { fixDuplicate } from './duplicate.js'

// Repeat a function with a combination of parameters.
// Meant for test-driven development.
export const testEach = function(...inputArgs) {
  const { iterables, func } = parseInput(inputArgs)

  const iterablesA = iterables.map(addRepeat)

  const loops = getCartesianLoops(iterablesA)

  const loopsA = loops.map(addNames)
  const loopsB = loopsA.map(fixDuplicate)

  const results = loopsB.map(loop => fireFunc(loop, func))
  return results
}

// The `name`, `names`, etc. are passed as first parameter so that:
//  - user can put `params` in an array (if needs be) using variadic syntax
//    `...params`
//  - user can omit `params` if only the information in the first parameter
//    is needed
// The return value of `func` is returned so that:
//  - `Promise.all(results)` can be use used if `func` is async
//  - user can retrieve `params`, `indexes`, etc. by returning them in `func`
const fireFunc = function({ name, names, index, indexes, params }, func) {
  return func({ name, names, index, indexes }, ...params)
}
