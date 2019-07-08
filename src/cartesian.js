// Remember indexes in arrays, so we can retrieve it after cartesian product
export const packParams = function(inputs) {
  return inputs.map(packParam)
}

const packParam = function(paramTitle, index) {
  return { index, paramTitle }
}

// Revert it after cartesian product
export const unpackParams = function(loop, index) {
  const indexes = loop.map(unpackIndex)
  const paramTitles = loop.map(unpackParamTitle)
  return { index, indexes, paramTitles }
}

const unpackIndex = function({ index }) {
  return index
}

const unpackParamTitle = function({ paramTitle }) {
  return paramTitle
}
