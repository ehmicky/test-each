// Ensure titles are unique by appending a counter when we find duplicates.
// This does not need to be applied to input functions: even if an input
// function always return the same value, the other parameters won't.
export const fixDuplicates = (input) => {
  if (typeof input === 'function') {
    return input
  }

  const nParams = input.map(normalizeParam)
  return input.map((param, index) => fixDuplicate(param, index, nParams))
}

const fixDuplicate = (param, index, nParams) => {
  const nParam = nParams[index]
  const duplicateParams = nParams.filter(
    (nParamA) => nParamA.title === nParam.title,
  )

  if (duplicateParams.length === 1) {
    return param
  }

  const duplicateCounter = duplicateParams.indexOf(nParam)
  const title = `${param.title} (${duplicateCounter})`
  return { value: param.value, title }
}

// Some test runners like Ava normalize|squash spaces when checking for
// duplicate test titles.
// This normalization is not kept, it is only used for the duplicate counters.
const normalizeParam = ({ value, title }) => ({
  value,
  title: title.replaceAll(SPACES_REGEXP, ' '),
})

const SPACES_REGEXP = /\s+/gu
