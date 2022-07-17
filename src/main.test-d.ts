import { each, iterable, Info, InputFunction } from 'test-each'
import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

const inputs: [(boolean | string)[], number[]] = [
  [true, 'a'],
  [1, 2],
]
each(...inputs, (info, a, b) => {
  expectType<boolean | string>(a)
  expectType<number>(b)

  expectAssignable<Info>(info)
  const { title, titles, index, indices } = info
  expectType<string>(title)
  expectType<string>(titles[0])
  expectType<typeof inputs.length>(titles.length)

  expectType<number>(index)
  expectType<number>(indices[0])
  expectType<typeof inputs.length>(indices.length)
})

for (const [info, a, b] of iterable(...inputs)) {
  expectType<boolean | string>(a)
  expectType<number>(b)

  expectAssignable<Info>(info)
  const { title, titles, index, indices } = info
  expectType<string>(title)
  expectType<string>(titles[0])
  expectType<typeof inputs.length>(titles.length)

  expectType<number>(index)
  expectType<number>(indices[0])
  expectType<typeof inputs.length>(indices.length)
}

expectAssignable<Generator<[Info, boolean | string, number], void, void>>(
  iterable(...inputs),
)
each([true, 'a'], 1, (info: Info, a: boolean | string, b: number) => {})
expectAssignable<Generator<[Info, boolean | string, number], void, void>>(
  iterable([true, 'a'], 1),
)
each(
  [true, 'a'],
  (info: Info) => 1,
  (info: Info) => {},
)
expectAssignable<Generator<[Info, boolean | string, number], void, void>>(
  iterable([true, 'a'], (info: Info) => 1),
)
each(
  [true, 'a'],
  (info: Info) => 1,
  (info: Info, a: boolean | string) => {},
)
expectAssignable<Generator<[Info, boolean | string, number], void, void>>(
  iterable([true, 'a'], (info: Info, arg: boolean | string) => 1),
)
expectError(
  each(
    [true, 'a'],
    (info: Info) => 1,
    (arg: boolean) => {},
  ),
)
expectAssignable<Generator<[Info, boolean | string, never], void, void>>(
  iterable([true, 'a'], (arg: boolean) => 1),
)
expectError(
  each(
    [true, 'a'],
    (info: Info) => 1,
    (info: Info, arg: number) => {},
  ),
)
expectAssignable<Generator<[Info, boolean | string, never], void, void>>(
  iterable([true, 'a'], (info: Info, arg: number) => 1),
)

expectAssignable<InputFunction>(() => {})
expectAssignable<InputFunction>((info: Info) => {})
expectNotAssignable<InputFunction>((info: boolean) => {})
expectAssignable<InputFunction<[[true, 'a'], [1, 2]]>>(
  (info: Info, a: boolean | string, b: number) => {},
)
expectNotAssignable<InputFunction<[[true, 'a'], [1, 2]]>>(
  (info: Info, a: boolean | string, b: boolean) => {},
)
expectNotAssignable<InputFunction<[[true, 'a'], [1, 2]]>>(
  (info: Info, a: number, b: number) => {},
)

for (const [, a] of iterable([{ b: true }])) {
  expectType<boolean>(a.b)
  expectError((a.b = false))
}
each([{ b: true }], (info, a) => {
  expectType<boolean>(a.b)
  expectError((a.b = false))
})
