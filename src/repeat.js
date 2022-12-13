// Using an integer is a shortcut for [0, 1, ...]
// This can be used together with input functions to do fuzz testing.
export const addRepeat = (input) => {
  if (!isRepeat(input)) {
    return input
  }

  return Array.from({ length: input }, getRepeatIndex)
}

export const isRepeat = (input) => Number.isInteger(input) && input >= 0

const getRepeatIndex = (value, index) => index
