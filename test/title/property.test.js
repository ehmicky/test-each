import { testSnapshots } from '../helpers/snapshot.test.js'

testSnapshots('`title` property', [
  [[{ title: 'a' }]],
  [[{ title: '' }]],
  [[{ title: ' ' }]],
  [[{ title: true }]],
])
