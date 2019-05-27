// Ensure titles are unique by appending a counter when we find duplicates
export const fixDuplicate = function(loop, index, loops) {
  const duplicateCounter = getDuplicateCounter(loop, loops)

  if (duplicateCounter === undefined) {
    return loop
  }

  const { title } = loop
  const titleA = `${title} (${duplicateCounter})`
  return { ...loop, title: titleA }
}

// The duplicate counter is scoped to each specific duplicates group.
// This makes the duplicate counters more stable:
//   - when changing other non-duplicate data
//   - when changing other duplicate data in the same iterable
// This is important in case the `title` is used in test snapshots.
// This also makes more sense for the users.
const getDuplicateCounter = function({ title, index }, loops) {
  const duplicateLoops = loops.filter(loop => loop.title === title)

  if (duplicateLoops.length === 1) {
    return
  }

  return duplicateLoops.findIndex(loop => loop.index === index)
}
