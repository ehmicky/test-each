// Using an integer is a shortcut for [0, 1, ...]
// This can be used together with functions to do fuzz testing.
export const addRepeat = function(iterable) {
  if (!isRepeat(iterable)) {
    return iterable
  }

  return Array.from({ length: iterable }, getRepeatIndex)
}

export const isRepeat = function(iterable) {
  return Number.isInteger(iterable) && iterable >= 0
}

const getRepeatIndex = function(value, index) {
  return index
}
