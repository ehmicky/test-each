import isPlainObj from 'is-plain-obj'
import prettyFormat from 'pretty-format'

// Add `title` to each `param`
// We do it before the cartesian product for performance reasons.
// Titles of input functions must be computed afterwards since we use their
// return value, which is performed after the cartesian product.
export const addTitles = function (input) {
  if (typeof input === 'function') {
    return input
  }

  return input.map(addTitle)
}

const addTitle = function (value) {
  const title = getTitle(value)
  return { value, title }
}

// After input functions have been triggered, we can compute their `titles`.
// Once all `titles` are known, we can then join them into a single `title`.
export const joinTitles = function ({ index, indexes, values, titles }) {
  const titlesA = titles.map((paramTitle, valueIndex) =>
    addFuncTitle(paramTitle, values[valueIndex]),
  )
  const title = titlesA.join(' ')
  return { title, titles: titlesA, index, indexes, values }
}

const addFuncTitle = function (title, value) {
  if (title !== undefined) {
    return title
  }

  return getTitle(value)
}

// Retrieve unique titles for each loop.
// Users can customize titles by using `info`.
const getTitle = function (value) {
  if (hasTitle(value)) {
    return value.title
  }

  const title = serialize(value)

  const titleA = truncateTitle(title)
  return titleA
}

// `{ title }` can be used to override the serialization logic
const hasTitle = function (value) {
  return (
    isPlainObj(value) &&
    typeof value.title === 'string' &&
    value.title.trim() !== ''
  )
}

// We use `pretty-format` because it:
//  - handles most JavaScript types
//  - works in browsers
//  - is fast
//  - has human-friendly output
//  - can minify output (including maxDepth)
//  - handles circular references
//  - can serialize DOM
const serialize = function (value) {
  const title = prettyFormat(value, PRETTY_FORMAT_OPTS)
  const titleA = ESCAPE_SEQUENCES.reduce(escapeSequence, title)
  return titleA
}

const PRETTY_FORMAT_OPTS = {
  min: true,
  maxDepth: 2,
  plugins: [
    prettyFormat.plugins.DOMElement,
    prettyFormat.plugins.DOMCollection,
    prettyFormat.plugins.ReactElement,
    prettyFormat.plugins.Immutable,
    prettyFormat.plugins.ConvertAnsi,
  ],
}

// Escape newline characters to ensure title is on a single line
const escapeSequence = function (title, [regExp, replacement]) {
  return title.replace(regExp, replacement)
}

const ESCAPE_SEQUENCES = [
  [/\n/gu, '\\n'],
  [/\r/gu, '\\r'],
  [/\f/gu, '\\f'],
  [/\v/gu, '\\v'],
]

// Make titles short by truncating them in the middle
const truncateTitle = function (title) {
  if (title.length <= MAX_TITLE_SIZE) {
    return title
  }

  const start = title.slice(0, TRUNCATE_START_LENGTH)
  const end = title.slice(title.length - TRUNCATE_END_LENGTH)
  return `${start}${ELLIPSIS}${end}`
}

const MAX_TITLE_SIZE = 120
const ELLIPSIS = '...'
const TRUNCATE_START_LENGTH = Math.ceil((MAX_TITLE_SIZE - ELLIPSIS.length) / 2)
const TRUNCATE_END_LENGTH = Math.floor((MAX_TITLE_SIZE - ELLIPSIS.length) / 2)
