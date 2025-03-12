// Returns the number of pixels that are overlapping
// between two elements. If negative, there's overlap.
// If positive, the number represents the number of pixels
// between the two elements.
const getOverlapDelta = (leftElement, rightElement) => {
  const left = rightElement.getBoundingClientRect().left
  const right = leftElement.getBoundingClientRect().right

  return left - right
}

export default getOverlapDelta
