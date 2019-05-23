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
  ([cartesian product](https://github.com/ehmicky/fast-cartesian))
- can use random generating functions
  ([fuzz testing](https://en.wikipedia.org/wiki/Fuzzing))
- [stringifies](https://github.com/facebook/jest/tree/master/packages/pretty-format)
  inputs into a unique `name` to use in test titles
- [snapshot testing](https://github.com/bahmutov/snap-shot-it#use) friendly
- works any
  [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterables):
  arrays,
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
