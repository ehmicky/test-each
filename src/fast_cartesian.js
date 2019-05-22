// Does a cartesian product on several iterables.
// Works with any iterable, including arrays, strings, generators, maps, sets.
export const fastCartesian = function(...iterables) {
  iterables.forEach(validateIterable)

  if (iterables.length === 0) {
    return []
  }

  const result = []
  iterate(iterables, result, [], 0)
  return result
}

const validateIterable = function(iterable) {
  if (iterable[Symbol.iterator] === undefined) {
    throw new TypeError(`Argument must be iterable: ${iterable}`)
  }
}

// We use imperative code as it faster than functional code, avoiding creating
// extra arrays. We try re-use and mutate arrays as much as possible.
// We need to make sure callers parameters are not mutated though.
/* eslint-disable max-params, fp/no-loops, fp/no-mutating-methods */
const iterate = function(iterables, result, values, index) {
  const iterable = iterables[index]

  if (iterable === undefined) {
    result.push(values.slice())
    return
  }

  for (const value of iterable) {
    values.push(value)
    iterate(iterables, result, values, index + 1)
    values.pop()
  }
}
/* eslint-enable max-params, fp/no-loops, fp/no-mutating-methods */
