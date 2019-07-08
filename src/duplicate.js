// Ensure titles are unique by appending a counter when we find duplicates
export const fixDuplicates = function(input) {
  if (typeof input === 'function') {
    return input
  }

  return input.map(fixDuplicate)
}

const fixDuplicate = function(paramTitle, index, paramTitles) {
  const duplicateParams = paramTitles.filter(
    paramTitleA => paramTitleA.title === paramTitle.title,
  )

  if (duplicateParams.length === 1) {
    return paramTitle
  }

  const duplicateCounter = duplicateParams.findIndex(
    paramTitleA => paramTitleA === paramTitle,
  )
  const title = `${paramTitle.title} (${duplicateCounter})`
  return { param: paramTitle.param, title }
}
