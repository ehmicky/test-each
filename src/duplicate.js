// Ensure titles are unique by appending a counter when we find duplicates.
// This does not need to be applied to input functions: even if an input
// function always return the same value, the other parameters won't.
export const fixDuplicates = function(input) {
  if (typeof input === 'function') {
    return input
  }

  return input.map(fixDuplicate)
}

const fixDuplicate = function(param, index, params) {
  const duplicateParams = params.filter(paramA => paramA.title === param.title)

  if (duplicateParams.length === 1) {
    return param
  }

  const duplicateCounter = duplicateParams.findIndex(paramA => paramA === param)
  const title = `${param.title} (${duplicateCounter})`
  return { value: param.value, title }
}
