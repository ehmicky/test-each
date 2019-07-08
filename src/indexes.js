// Remember indexes in arrays, so we can retrieve it after cartesian product
export const wrapIndexes = function(inputs) {
  return inputs.map(wrapIndex)
}

const wrapIndex = function({ param, title }, index) {
  return { index, param, title }
}

// Revert it after cartesian product
export const unwrapIndexes = function(loop, index) {
  const indexes = loop.map(unwrapIndex)
  const params = loop.map(unpackParam)
  const titles = loop.map(unpackTitle)
  return { index, indexes, params, titles }
}

const unwrapIndex = function({ index }) {
  return index
}

const unpackParam = function({ param }) {
  return param
}

const unpackTitle = function({ title }) {
  return title
}
