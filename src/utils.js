// Is a plain object, including `Object.create(null)`
export const isPlainObject = function(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value.constructor === Object || value.constructor === undefined)
  )
}
