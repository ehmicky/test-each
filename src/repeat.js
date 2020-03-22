// Using an integer is a shortcut for [0, 1, ...]
// This can be used together with input functions to do fuzz testing.
export const addRepeat = function (input) {
  if (!isRepeat(input)) {
    return input
  }

  return Array.from({ length: input }, getRepeatIndex)
}

export const isRepeat = function (input) {
  return Number.isInteger(input) && input >= 0
}

const getRepeatIndex = function (value, index) {
  return index
}
