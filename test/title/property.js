import { testSnapshots } from '../helpers/snapshot.js'

testSnapshots('`title` property', [
  [[{ title: 'a' }]],
  [[{ title: '' }]],
  [[{ title: ' ' }]],
  [[{ title: true }]],
])
