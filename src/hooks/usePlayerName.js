import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import useOutsideDetection from './useOutsideDetection'
import getOverlapDelta from '../utilities/getOverlapDelta'

const usePlayerName = (
  defaultName,
  maxFontSize,
  minFontSize,
  bladerNameRef,
  bladerNameEntryRef,
  scoreControlsRef,
  position
) => {
  const [bladerName, setBladerName] = useState(defaultName)
  const [fontSize, setFontSize] = useState(maxFontSize)
  const [editingBlader, setEditingBlader] = useState(false)
  const [bladerNameEntryWidth, setBladerNameEntryWidth] = useState(maxFontSize)
  const [isPortrait, setIsPortrait] = useState(false)

  // For most browsers, the scorekeeper's orientation is
  // locked to landscape. Safari is the exception, so we
  // need extra handling for portrait orientation.
  window.addEventListener('orientationchange', () => {
    setIsPortrait(window.matchMedia('(orientation: portrait)').matches)
  })

  const confirmBladerName = () => {
    if (bladerNameEntryRef.current.value === '') {
      // Prevent setting name to empty string.
      toast.error('Name cannot be empty')
      setBladerName(defaultName)
    }

    setEditingBlader(false)
  }

  useOutsideDetection(bladerNameEntryRef, () => {
    confirmBladerName()
  })

  useEffect(() => {
    setBladerNameEntryWidth(bladerName.length)
  }, [bladerName])

  // Resize name when it, its font size, or the orientation
  // changes, or when the user starts or finishes editing.
  useEffect(() => {
    const ref = editingBlader ? bladerNameEntryRef : bladerNameRef

    // When the name is positioned on the left side of the screen,
    // it is positioned to the right of the score controls
    //ref. Otherwise, it is positioned to the left of the
    // scorecontrols ref. To determine overlap, we need to determine
    // which is which.
    const leftElement =
      position === 'left' ? scoreControlsRef.current : ref.current
    const rightElement =
      position === 'left' ? ref.current : scoreControlsRef.current

    const overlapDelta = getOverlapDelta(leftElement, rightElement)

    if (overlapDelta < 0 && fontSize > minFontSize) {
      setFontSize((prevState) => prevState - 1)
    } else if (overlapDelta > 15 && fontSize < maxFontSize) {
      setFontSize((prevState) => prevState + 1)
    }
  }, [fontSize, bladerName, editingBlader, isPortrait])

  useEffect(() => {
    if (editingBlader) {
      bladerNameEntryRef.current.select()
    }
  }, [editingBlader])

  const handleBladerEntryKeyUp = (e) => {
    if (e.keyCode === 13) {
      // Enter/Return pressed.
      confirmBladerName()
    }
  }

  return {
    bladerName,
    setBladerName,
    bladerNameRef,
    bladerNameEntryRef,
    bladerNameEntryWidth,
    fontSize,
    editingBlader,
    setEditingBlader,
    handleBladerEntryKeyUp,
  }
}

export default usePlayerName
