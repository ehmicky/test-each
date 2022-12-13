// Remember indexes of parameters for each `input`, so we can retrieve it after
// cartesian product
export const wrapIndexes = (inputs) => inputs.map(wrapIndex)

const wrapIndex = ({ value, title }, index) => ({ index, value, title })

// Revert it after cartesian product
export const unwrapIndexes = (loop, index) => {
  const indexes = loop.map(unwrapIndex)
  const values = loop.map(unpackValue)
  const titles = loop.map(unpackTitle)
  return { index, indexes, values, titles }
}

const unwrapIndex = ({ index }) => index

const unpackValue = ({ value }) => value

const unpackTitle = ({ title }) => title
