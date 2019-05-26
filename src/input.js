import { isRepeat } from './repeat.js'

// Parse and validate main input
export const parseInput = function(args) {
  const [iterables, callback] = splitInput(args)
  iterables.forEach(validateIterable)
  return { iterables, callback }
}

const splitInput = function(args) {
  const lastArg = args[args.length - 1]

  if (typeof lastArg !== 'function') {
    return [args, defaultCallback]
  }

  return [args.slice(0, -1), lastArg]
}

// `callback` is optional and defaults to returning arguments as is
const defaultCallback = function(...args) {
  return args
}

const validateIterable = function(iterable) {
  if (iterable[Symbol.iterator] === undefined && !isRepeat(iterable)) {
    throw new TypeError(
      `Argument must be an iterable or a positive integer: ${iterable}`,
    )
  }
}
