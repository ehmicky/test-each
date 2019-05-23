[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/test-each.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/test-each)
[![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis)](https://travis-ci.org/ehmicky/test-each)
[![Node](https://img.shields.io/node/v/test-each.svg?logo=node.js)](https://www.npmjs.com/package/test-each)
[![Gitter](https://img.shields.io/gitter/room/ehmicky/test-each.svg?logo=gitter)](https://gitter.im/ehmicky/test-each)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

Work in progress, not published to `npm` yet!

🤖 Repeat tests. Repeat tests. Repeat tests.

Repeats tests using different inputs
([Data-Driven Testing](https://en.wikipedia.org/wiki/Data-driven_testing)):

- test runner independent: works with your current test setup
- loops over every possible combination of inputs
  ([cartesian product](#cartesian-product))
- can use random generating functions ([fuzz testing](#fuzz-testing))
- stringifies inputs into a [unique `name`](#names) to use in test titles
- [snapshot testing](#snapshot-testing) friendly
- works any [iterable](#iterables): arrays,
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

// Repeat test using different inputs and expected values
testEach(
  [{ first: 2, second: 2, result: 4 }, { first: 3, second: 3, result: 9 }],
  ({ name }, { first, second, result }) => {
    // Test title will be:
    //   'should multiply | {"first": 2, "second": 2, "result": 4}', etc.
    test(`should multiply | ${name}`, t => {
      t.is(multiply(first, second), result)
    })
  },
)

// Snapshot testing. The `result` is implicitly set on the first run,
// then re-used in the next runs.
testEach(
  [{ first: 2, second: 2 }, { first: 3, second: 3 }],
  ({ name }, { first, second }) => {
    test(`should multiply results | ${name}`, t => {
      t.snapshot(multiply(first, second))
    })
  },
)

// Cartesian product.
// Run this test 12 times using every possible combination of methods and inputs
testEach(
  [multiply, divide, add, substract],
  ['invalid', false, null],
  ({ name }, method, input) => {
    test(`should only allow numbers as input | ${name}`, t => {
      t.throws(() => method(input))
    })
  },
)

// Fuzz testing. Run this test 1000 times using different numbers.
testEach(1000, [() => Math.random()], ({ name }, index, randomNumber) => {
  test(`should correctly substract floats | ${name}`, t => {
    t.is(substract(randomNumber, randomNumber), 0)
  })
})

// Works with any iterable. Run this test 10 times using different digits.
testEach('012345679', ({ name }, digit) => {
  test(`should allow stringified numbers | ${name}`, t => {
    t.is(multiply(digit, 1), digit)
  })
})
```

# Demo

You can try this library:

- either directly [in your browser](https://repl.it/@ehmicky/test-each).
- or by executing the [`examples` files](examples/README.md) in a terminal.

# Install

```
npm install -D test-each
```

# Usage

Iterates over `inputs` and fires `callback` with each set of parameters.

You can do anything inside `callback`. The most common use case is to define
tests (using any test runner).

The return value of each `callback` is returned as an `array`. This means
`callback` arguments can be retrieved outside of the `callback`.

```js
// `values` will be ['ac', 'ad', 'bc', 'bd']
const values = testEach(['a', 'b'], ['c', 'd'], (info, first, second) => {
  return `${first}${second}`
})
```

If the parameters are objects and you need to modify them, they should be cloned
to prevent side-effects in the next iterations. You can use
[input functions](#fuzz-testing) to achieve this without additional libraries.

```js
// This should not be done, as the objects are re-used in several iterations
testEach(
  [{ attr: true }, { attr: false }],
  ['dev', 'staging', 'production'],
  (info, value, env) => {
    value.attr = !value.attr
  },
)

// But this is safe
testEach(
  [() => ({ attr: true }), () => ({ attr: false })],
  ['dev', 'staging', 'production'],
  (info, value, env) => {
    value.attr = !value.attr
  },
)
```

### Cartesian product

If several `inputs` are specified, their
[cartesian product](https://github.com/ehmicky/fast-cartesian) is used.

```js
// Run callback five times: a -> b -> c -> d -> e
testEach(['a', 'b', 'c', 'd', 'e'], (info, value) => {})

// Run callback six times: a c -> a d -> a e -> b c -> b d -> b e
testEach(['a', 'b'], ['c', 'd', 'e'], (info, value, otherValue) => {})

// Nested arrays are not iterated.
// So this runs callback twice: ['a', 'b'] -> ['c', 'd', 'e']
testEach([['a', 'b'], ['c', 'd', 'e']], (info, value) => {})

// Strings are iterable.
// Run callback five times: a -> b -> c -> d -> e
testEach('abcde', (info, value) => {})
```

### Fuzz testing

If an `input` is a `function`, each iteration will fire it and use its return
value instead. The `function` is called with the other parameters as arguments.

An `input` can also be an `integer` to repeat the tests with the same `inputs`
several times.

```js
// Run callback 1000 times with a different random number each time
testEach(1000, [() => Math.random()], (info, randomNumber) => {})

// Input functions are called with the other parameters as arguments
testEach(
  ['02', '15', '30'],
  ['January', 'February', 'March'],
  ['1980', '1981'],
  [
    (day, month, year) => `${day}/${month}/${year}`,
    (day, month, year) => `${month}/${day}/${year}`,
  ],
  (info, day, month, year, date) => {},
)

// To pass a function as input without firing it, wrap it in an object
testEach(
  [{ getValue: () => true }, { getValue: () => false }],
  (info, { getValue }) => {},
)
```

This enables [fuzz testing](https://en.wikipedia.org/wiki/Fuzzing) when combined
with libraries like [faker.js](https://github.com/marak/Faker.js),
[chance.js](https://github.com/chancejs/chancejs) or
[json-schema-faker](https://github.com/json-schema-faker/json-schema-faker).

```js
const faker = require('faker')

testEach(
  1000,
  [faker.random.uuid],
  [faker.random.arrayElement(['dev', 'staging', 'production'])],
  (info, randomUuid, randomEnv) => {},
)
```

You can combine this with closures in order to persist state between iterations.

```js
const getExponential = function() {
  let count = 1
  return () => (count *= 2)
}

// `number` will be 2 -> 4 -> 8 -> etc.
testEach(1000, [getExponential()], (info, number) => {})
```

### Snapshot testing

This library works well with
[snapshot testing](https://github.com/bahmutov/snap-shot-it#use).

```js
// The `result` is implicitly set on the first run,
// then re-used in the next runs.
testEach(
  [{ first: 2, second: 2 }, { first: 3, second: 3 }],
  ({ name }, { first, second }) => {
    test(`should multiply results | ${name}`, t => {
      t.snapshot(multiply(first, second))
    })
  },
)
```

### Names

Each combination of `inputs` is stringified as a `name`. It is passed in the
`callback`'s first argument.

This should be included in test titles in order to:

- make them more descriptive
- ensure they are unique. An incrementing counter is appended to duplicates.

Every JavaScript type is
[supported](https://github.com/facebook/jest/tree/master/packages/pretty-format).
Names are kept short and truncated if needs be.

To customize names you can either:

- define `name` properties in `inputs`, providing those are
  [plain objects](https://stackoverflow.com/questions/52453407/the-different-between-object-and-plain-object-in-javascript).
- use the `info` argument

```js
// `name` will be '{"attr": true}' then '{"attr": false}'
testEach([{ attr: true }, { attr: false }], ({ name }, object) => {
  // Test titles will be:
  //   'should work | {"attr": true}'
  //   'should work | {"attr": false}'
  test(`should work | ${name}`, () => {})
})

// Plain objects can override this using a `name` property
testEach(
  [{ attr: true, name: 'True' }, { attr: false, name: 'False' }],
  ({ name }, object) => {
    // Test titles will be:
    //   'should work | True'
    //   'should work | False'
    test(`should work | ${name}`, () => {})
  },
)

// The `info` argument can be used for more flexible names
testEach([{ attr: true }, { attr: false }], ({ index }, object) => {
  // Test titles will be:
  //   'should work | 0'
  //   'should work | 1'
  test(`should work | ${name}`, () => {})
})
```

### Iterables

`inputs` can be any
[iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterables):
`array`,
[`generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator),
`string`, `Map`, `Set`, etc.).

# API

## testEach(...inputs, callback)

`inputs`: `iterable | integer` <br>`callback`: `function(info, ...params)` <br>
_Return value_: `any[]`

### `info`

_Type_: `object`

First argument of each `callback`.

#### `info.name`

_Type_: `string`

Callback's `params` stringified. Should be used in test titles.

#### `info.names`

_Type_: `string[]`

Like `info.name` but for each `params`.

#### `info.index`

_Type_: `integer`

Incremented on each iteration. Starts at `0`.

#### `info.indexes`

_Type_: `integer[]`

Index of each `params` inside the initial `inputs`.

### `params`

_Type_: `any`

Last arguments of each `callback`.

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
