import { isRepeat } from './repeat.js'

// Parse and validate main input
export const parseInput = function(args) {
  const [argsA, callback] = splitInput(args)
  argsA.forEach(validateArg)
  return [argsA, callback]
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

const validateArg = function(arg) {
  if (!isIterable(arg) && !isRepeat(arg) && typeof arg !== 'function') {
    throw new TypeError(
      `Argument must be an iterable, a positive integer or a function: ${arg}`,
    )
  }
}

const isIterable = function(arg) {
  return arg !== undefined && arg !== null && arg[Symbol.iterator] !== undefined
}
