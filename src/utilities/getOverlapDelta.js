// Returns the number of pixels that are overlapping
// between two elements. If negative, there's overlap.
// If positive, the number represents the number of pixels
// between the two elements.
const getOverlapDelta = (leftElement, rightElement) => {
  let orientation = 'landscape'

  if (window.matchMedia('(orientation: portrait)').matches) {
    // In portrait orientation, everything is vertical, so
    // we need to check the top and bottom of the elements
    // instead of left and right.
    orientation = 'portrait'
  }

  const leftElementRect = leftElement.getBoundingClientRect()
  const rightElementRect = rightElement.getBoundingClientRect()

  const left =
    orientation === 'portrait' ? rightElementRect.top : rightElementRect.left
  const right =
    orientation === 'portrait' ? leftElementRect.bottom : leftElementRect.right

  return left - right
}

export default getOverlapDelta
