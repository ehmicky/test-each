/**
 * Object whose properties can be used to generate test titles.
 */
export type Info<InputArrays = unknown[][]> = Readonly<{
  /**
   * Each combination of parameters is stringified as a `title`.
   * Titles should be included in test titles to make them descriptive and
   * unique.
   *
   * @example
   * ```js
   * each([{ color: 'red' }, { color: 'blue' }], ({ title }, param) => {
   *   // Test titles will be:
   *   //    should test color | {"color": "red"}
   *   //    should test color | {"color": "blue"}
   *   test(`should test color | ${title}`, () => {})
   * })
   *
   * // Plain objects can override this using a `title` property
   * each(
   *   [
   *     { color: 'red', title: 'Red' },
   *     { color: 'blue', title: 'Blue' },
   *   ],
   *   ({ title }, param) => {
   *     // Test titles will be:
   *     //    should test color | Red
   *     //    should test color | Blue
   *     test(`should test color | ${title}`, () => {})
   *   },
   * )
   *
   * // The `info` argument can be used for dynamic titles
   * each([{ color: 'red' }, { color: 'blue' }], (info, param) => {
   *   // Test titles will be:
   *   //    should test color | 0 red
   *   //    should test color | 1 blue
   *   test(`should test color | ${info.index} ${param.color}`, () => {})
   * })
   * ```
   */
  title: string

  /**
   * Like `info.title` but for each input.
   */
  titles: { [index in keyof InputArrays]: string }

  /**
   * Incremented on each iteration. Starts at `0`.
   */
  index: number

  /**
   * Index of each parameter inside each initial input.
   */
  indices: { [index in keyof InputArrays]: number }
}>

type UnknownFunction = (...args: never[]) => unknown

type InputArraysArgs = (unknown[] | number | UnknownFunction)[]

type CartesianProduct<InputArrays extends InputArraysArgs> = {
  [index in keyof InputArrays]: Readonly<
    InputArrays[index] extends (infer InputElement)[]
      ? InputElement
      : InputArrays[index] extends number
      ? number
      : InputArrays[index] extends InputFunction<InputArrays>
      ? ReturnType<InputArrays[index]>
      : never
  >
}

/**
 * Input function used as input.
 * Each iteration fires it and uses its return value.
 * The function is called with the same arguments as the `callback`.
 *
 * @example
 * ```js
 * // Run callback with a different random number each time
 * each(['red', 'green', 'blue'], Math.random, (info, color, randomNumber) => {})
 *
 * // Input functions are called with the same arguments as the callback
 * each(
 *   ['02', '15', '30'],
 *   ['January', 'February', 'March'],
 *   ['1980', '1981'],
 *   (info, day, month, year) => `${day}/${month}/${year}`,
 *   (info, day, month, year, date) => {},
 * )
 * ```
 */
export type InputFunction<InputArrays extends InputArraysArgs = unknown[][]> = (
  info: Info,
  ...args: InputFunctionArgs<InputArrays>
) => unknown

type InputFunctionArgs<InputArrays extends InputArraysArgs> = {
  readonly [index in keyof InputArrays]: Readonly<
    InputArrays[index] extends (infer InputElement)[]
      ? InputElement
      : InputArrays[index] extends UnknownFunction
      ? InputArrays[index]
      : InputArrays[index] extends number
      ? number
      : never
  >
}

/**
 * Returns an
 * [`Iterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterables)
 * looping through each combination of the inputs.
 *
 * @example
 * ```js
 * const combinations = iterable(
 *   ['green', 'red', 'blue'],
 *   [{ active: true }, { active: false }],
 * )
 *
 * for (const [{ title }, color, param] of combinations) {
 *   test(`should test color | ${title}`, () => {})
 * }
 * ```
 */
export function iterable<InputArrays extends InputArraysArgs>(
  ...inputs: [...InputArrays]
): Generator<[Info<InputArrays>, ...CartesianProduct<InputArrays>], void, void>

/**
 * Fires `callback` with each combination of the inputs.
 *
 * @example
 * ```js
 * // The examples use Ava but any test runner works (Jest, Mocha, Jasmine, etc.)
 * import test from 'ava'
 *
 * // The code we are testing
 * import multiply from './multiply.js'
 *
 * // Repeat test using different inputs and expected outputs
 * each(
 *   [
 *     { first: 2, second: 2, output: 4 },
 *     { first: 3, second: 3, output: 9 },
 *   ],
 *   ({ title }, { first, second, output }) => {
 *     // Test titles will be:
 *     //    should multiply | {"first": 2, "second": 2, "output": 4}
 *     //    should multiply | {"first": 3, "second": 3, "output": 9}
 *     test(`should multiply | ${title}`, (t) => {
 *       t.is(multiply(first, second), output)
 *     })
 *   },
 * )
 *
 * // Snapshot testing. The `output` is automatically set on the first run,
 * // then re-used in the next runs.
 * each(
 *   [
 *     { first: 2, second: 2 },
 *     { first: 3, second: 3 },
 *   ],
 *   ({ title }, { first, second }) => {
 *     test(`should multiply outputs | ${title}`, (t) => {
 *       t.snapshot(multiply(first, second))
 *     })
 *   },
 * )
 *
 * // Cartesian product.
 * // Run this test 4 times using every possible combination of inputs
 * each([0.5, 10], [2.5, 5], ({ title }, first, second) => {
 *   test(`should mix integers and floats | ${title}`, (t) => {
 *     t.is(typeof multiply(first, second), 'number')
 *   })
 * })
 *
 * // Fuzz testing. Run this test 1000 times using different numbers.
 * each(1000, Math.random, ({ title }, index, randomNumber) => {
 *   test(`should correctly multiply floats | ${title}`, (t) => {
 *     t.is(multiply(randomNumber, 1), randomNumber)
 *   })
 * })
 * ```
 */
export function each<InputArrays extends InputArraysArgs>(
  ...args: [
    ...inputs: [...InputArrays],
    callback: (
      info: Info<InputArrays>,
      ...params: CartesianProduct<InputArrays>
    ) => void,
  ]
): void
