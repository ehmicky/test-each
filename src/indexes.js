// Remember indexes in arrays, so we can retrieve it after cartesian product
export const wrapIndexes = function(inputs) {
  return inputs.map(wrapIndex)
}

const wrapIndex = function(paramTitle, index) {
  return { index, paramTitle }
}

// Revert it after cartesian product
export const unwrapIndexes = function(loop, index) {
  const indexes = loop.map(unwrapIndex)
  const paramTitles = loop.map(unpackParamTitle)
  return { index, indexes, paramTitles }
}

const unwrapIndex = function({ index }) {
  return index
}

const unpackParamTitle = function({ paramTitle }) {
  return paramTitle
}
