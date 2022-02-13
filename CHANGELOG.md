# 4.0.0

- The default test titles now truncate arrays with more than 5 elements. This is
  only a breaking change if you use test snapshots and some of the test
  parameters have long arrays.

# 3.0.1

## Bug fixes

- Fix `main` field in `package.json`

# 3.0.0

## Breaking changes

- Minimal supported Node.js version is now `12.20.0`
- This package is now an ES module. It can only be loaded with an `import` or
  `import()` statement, not `require()`. See
  [this post for more information](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

# 2.0.1

## Dependencies

- Remove `core-js`

# 2.0.0

## Breaking changes

- Minimal supported Node.js version is now `10.17.0`
