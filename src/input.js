import { isRepeat } from './repeat.js'

// Parse and validate main input
export const parseInput = function(args) {
  const { iterables, func } = splitInput(args)
  iterables.forEach(validateIterable)
  return { iterables, func }
}

const splitInput = function(args) {
  const lastArg = args[args.length - 1]

  if (typeof lastArg !== 'function') {
    return { iterables: args, func: defaultCallback }
  }

  const iterables = args.slice(0, -1)
  return { iterables, func: lastArg }
}

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
