[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/test-each.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/test-each)
[![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis)](https://travis-ci.org/ehmicky/test-each)
[![Node](https://img.shields.io/node/v/test-each.svg?logo=node.js)](https://www.npmjs.com/package/test-each)
[![Gitter](https://img.shields.io/gitter/room/ehmicky/test-each.svg?logo=gitter)](https://gitter.im/ehmicky/test-each)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

🤖 Repeat tests. Repeat tests. Repeat tests.

Repeats tests using different inputs
([Data-Driven Testing](https://en.wikipedia.org/wiki/Data-driven_testing)):

- test runner independent: works with your current test setup
- loops over every possible combination of inputs
  ([cartesian product](#cartesian-product))
- can use random functions ([fuzz testing](#fuzz-testing))
- generates [nice test titles](#names)
- [snapshot testing](#snapshot-testing) friendly
- works with any [iterable](#iterables): arrays,
  [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator),
  strings, maps, sets, etc.

# Example

<!-- eslint-disable max-nested-callbacks -->

```js
// The examples use Ava but any test runner works (Jest, Mocha, etc.)
const test = require('ava')
const testEach = require('test-each')

// The code we are testing
const { multiply, divide, add, substract } = require('./math.js')

// Repeat test using different inputs and expected outputs
testEach(
  [{ first: 2, second: 2, output: 4 }, { first: 3, second: 3, output: 9 }],
  ({ name }, { first, second, output }) => {
    // Test titles will be:
    //   should multiply | {"first": 2, "second": 2, "output": 4}
    //   should multiply | {"first": 4, "second": 4, "output": 9}
    test(`should multiply | ${name}`, t => {
      t.is(multiply(first, second), output)
    })
  },
)

// Snapshot testing. The `output` is implicitly set on the first run,
// then re-used in the next runs.
testEach(
  [{ first: 2, second: 2 }, { first: 3, second: 3 }],
  ({ name }, { first, second }) => {
    test(`should multiply outputs | ${name}`, t => {
      t.snapshot(multiply(first, second))
    })
  },
)

// Cartesian product.
// Run this test 12 times using every possible combination of methods and inputs
testEach(
  [multiply, divide, add, substract],
  ['invalid', false, null],
  ({ name }, method, param) => {
    test(`should only allow numbers as input | ${name}`, t => {
      t.throws(() => method(param, param))
    })
  },
)

// Fuzz testing. Run this test 1000 times using different numbers.
testEach(1000, [Math.random], ({ name }, index, randomNumber) => {
  test(`should correctly substract floats | ${name}`, t => {
    t.is(substract(randomNumber, randomNumber), 0)
  })
})

// Works with any iterable. Run this test 10 times using each digit.
testEach('012345679', ({ name }, digit) => {
  test(`should allow stringified numbers | ${name}`, t => {
    t.is(multiply(digit, 1), digit)
  })
})
```

<!--

# Demo

You can try this library:

- either directly [in your browser](https://repl.it/@ehmicky/test-each).
- or by executing the [`examples` files](examples/README.md) in a terminal.

-->

# Install

```
npm install -D test-each
```

# Usage

<!-- eslint-disable no-empty-function -->

```js
const testEach = require('test-each')

const inputs = [['red', 'green'], [0, 10, 50]]
testEach(...inputs, function callback(info, color, number) {})
```

Fires `callback` once for each possible combination of `inputs`.

A common use case for `callback` is to define tests (using any test runner).

[`info`](#info) is an `object` whose properties can be used to generate
[test titles](#names).

### Cartesian product

If several `inputs` are specified, their
[cartesian product](https://github.com/ehmicky/fast-cartesian) is used.

<!-- eslint-disable no-empty-function -->

```js
// Run callback five times: a -> b -> c -> d -> e
testEach(['a', 'b', 'c', 'd', 'e'], (info, param) => {})

// Run callback six times: a c -> a d -> a e -> b c -> b d -> b e
testEach(['a', 'b'], ['c', 'd', 'e'], (info, param, otherParam) => {})

// Nested arrays are not iterated.
// This runs callback twice with an array `param`: ['a', 'b'] -> ['c', 'd', 'e']
testEach([['a', 'b'], ['c', 'd', 'e']], (info, param) => {})
```

### Input functions

If an `input` is a `function`, it is fired once per iteration and its return
value is used instead. The `function` is called with the same parameters as the
`callback`.

<!-- eslint-disable no-empty-function, max-params -->

```js
// Run callback with a different random number each time
testEach(
  ['red', 'green', 'blue'],
  [Math.random],
  (info, color, randomNumber) => {},
)

// Input functions are called with the same parameters as the callback
testEach(
  ['02', '15', '30'],
  ['January', 'February', 'March'],
  ['1980', '1981'],
  [
    (info, day, month, year) => `${day}/${month}/${year}`,
    (info, day, month, year) => `${month}/${day}/${year}`,
  ],
  (info, day, month, year, date) => {},
)

// To pass a function as input without firing it, wrap it in an object
testEach(
  [{ getValue: () => true }, { getValue: () => false }],
  (info, { getValue }) => {},
)
```

### Fuzz testing

Integers can be used instead of iterables to multiply the number of iterations.

This enables [fuzz testing](https://en.wikipedia.org/wiki/Fuzzing) when combined
with [input functions](#input-functions) and libraries like
[faker.js](https://github.com/marak/Faker.js),
[chance.js](https://github.com/chancejs/chancejs) or
[json-schema-faker](https://github.com/json-schema-faker/json-schema-faker).

<!-- eslint-disable no-empty-function -->

```js
const faker = require('faker')

// Run callback 1000 times with a random UUID and color each time
testEach(
  1000,
  [faker.random.uuid],
  [faker.random.arrayElement(['green', 'red', 'blue'])],
  (info, randomUuid, randomColor) => {},
)
```

### Snapshot testing

This library works well with
[snapshot testing](https://github.com/bahmutov/snap-shot-it#use).

Any library can be used
([`snap-shot-it`](https://github.com/bahmutov/snap-shot-it),
[Ava snapshots](https://github.com/avajs/ava/blob/master/docs/04-snapshot-testing.md),
[Jest snapshots](https://jestjs.io/docs/en/snapshot-testing),
[Node TAP snapshots](https://www.node-tap.org/snapshots/), etc.).

<!-- eslint-disable max-nested-callbacks -->

```js
// The `output` is implicitly set on the first run,
// then re-used in the next runs.
testEach(
  [{ first: 2, second: 2 }, { first: 3, second: 3 }],
  ({ name }, { first, second }) => {
    test(`should multiply outputs | ${name}`, t => {
      t.snapshot(multiply(first, second))
    })
  },
)
```

### Names

Each combination of parameters is stringified as a `name` available in the
`callback`'s first argument.

Names should be included in test titles to make them descriptive and unique.

Long names are truncated. An incrementing counter is appended to duplicates.

Any JavaScript type is
[stringified](https://github.com/facebook/jest/tree/master/packages/pretty-format),
not just JSON.

You can customize names either by:

- defining `name` properties in `inputs` that are
  [plain objects](https://stackoverflow.com/questions/52453407/the-different-between-object-and-plain-object-in-javascript)
- using the [`info` argument](#info)

<!-- eslint-disable max-nested-callbacks, no-empty-function -->

```js
testEach([{ attr: true }, { attr: false }], ({ name }, object) => {
  // Test titles will be:
  //   should work | {"attr": true}
  //   should work | {"attr": false}
  test(`should work | ${name}`, () => {})
})

// Plain objects can override this using a `name` property
testEach(
  [{ attr: true, name: 'True' }, { attr: false, name: 'False' }],
  ({ name }, object) => {
    // Test titles will be:
    //   should work | True
    //   should work | False
    test(`should work | ${name}`, () => {})
  },
)

// The `info` argument can be used for dynamic names
testEach([{ attr: true }, { attr: false }], (info, object) => {
  // Test titles will be:
  //   should work | 0
  //   should work | 1
  test(`should work | ${info.index}`, () => {})
})
```

### Iterables

`inputs` can be any
[iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterables):
`array`,
[`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator),
`string`, `Map`, `Set`, etc.

<!-- eslint-disable no-empty-function -->

```js
// Run callback five times: a -> b -> c -> d -> e
testEach('abcde', (info, param) => {})
```

### Modifying parameters

Object parameters that are directly modified should be cloned to prevent
side-effects for the next iterations. You can use
[input functions](#fuzz-testing) to achieve this without additional libraries.

<!-- eslint-disable fp/no-mutation, no-param-reassign -->

```js
testEach(
  [{ attr: true }, { attr: false }],
  ['green', 'red', 'blue'],
  (info, param, color) => {
    // This should not be done, as the objects are re-used in several iterations
    param.attr = !param.attr
  },
)

// But this is safe since each iteration creates a new object
testEach(
  [() => ({ attr: true }), () => ({ attr: false })],
  ['green', 'red', 'blue'],
  (info, param, color) => {
    param.attr = !param.attr
  },
)
```

### Return value

Just like `Array.map()`, `testEach()` aggregates the return value of each
`callback` and returns it as an `array`.

This can be used to pass information (for example the parameters) from the
`callback` to its caller.

```js
// `values` will be ['ac', 'ad', 'bc', 'bd']
const values = testEach(['a', 'b'], ['c', 'd'], (info, first, second) => {
  return `${first}${second}`
})
```

# API

## testEach(...inputs, callback)

`inputs`: [`iterable`](#iterables) or [`integer`](#input-functions) (one or
[several](#cartesian-product))<br>`callback`: `function(info, ...params)` <br>
[_Return value_](#return-value): `any[]`

### info

_Type_: `object`

#### info.name

_Type_: `string`

Like [`params`](#params) but stringified. Should be used in test titles.

#### info.names

_Type_: `string[]`

Like [`info.name`](#infoname) but for each [`params`](#params).

#### info.index

_Type_: `integer`

Incremented on each iteration. Starts at `0`.

#### info.indexes

_Type_: `integer[]`

Index of each [`params`](#params) inside the initial
[`inputs`](#testeachinputs-callback).

### params

_Type_: `any` (one or [several](#cartesian-product))

# Support

If you found a bug or would like a new feature, _don't hesitate_ to
[submit an issue on GitHub](../../issues).

For other questions, feel free to
[chat with us on Gitter](https://gitter.im/ehmicky/test-each).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/test-each/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/test-each/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
