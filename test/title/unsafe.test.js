import { testSnapshots } from '../helpers/snapshot.js'

testSnapshots(
  'Titles serialization for unsafe properties',
  [
    [
      [
        {
          // eslint-disable-next-line fp/no-get-set
          get argA() {
            throw new Error('test')
          },
        },
      ],
    ],
  ],
  true,
)

const PROXY_METHODS = [
  'set',
  'get',
  'deleteProperty',
  'has',
  'ownKeys',
  'defineProperty',
  'getOwnPropertyDescriptor',
  'isExtensible',
  'preventExtensions',
  'getPrototypeOf',
  'setPrototypeOf',
  'apply',
  'constructor',
]

PROXY_METHODS.forEach((proxyMethod) => {
  testSnapshots(
    `Titles serialization for proxies | ${proxyMethod}`,
    [
      [
        [
          // eslint-disable-next-line fp/no-proxy
          new Proxy(
            {},
            {
              [proxyMethod]() {
                throw new Error('unsafe')
              },
            },
          ),
        ],
      ],
    ],
    true,
  )
})
