// Remember indexes of parameters for each `input`, so we can retrieve it after
// cartesian product
export const wrapIndexes = function (inputs) {
  return inputs.map(wrapIndex)
}

const wrapIndex = function ({ value, title }, index) {
  return { index, value, title }
}

// Revert it after cartesian product
export const unwrapIndexes = function (loop, index) {
  const indexes = loop.map(unwrapIndex)
  const values = loop.map(unpackValue)
  const titles = loop.map(unpackTitle)
  return { index, indexes, values, titles }
}

const unwrapIndex = function ({ index }) {
  return index
}

const unpackValue = function ({ value }) {
  return value
}

const unpackTitle = function ({ title }) {
  return title
}
