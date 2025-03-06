import { useEffect, useState } from 'react'

const useScoreTracking = () => {
  const [scores, setScores] = useState({
    playerOneRounds: 0,
    playerOnePoints: 0,
    playerTwoRounds: 0,
    playerTwoPoints: 0,
  })
  const [undoables, setUndoables] = useState([])
  const [redoables, setRedoables] = useState([])
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    setCanUndo(undoables.length > 0)
    setCanRedo(redoables.length > 0)
  }, [undoables, redoables])

  const processCommand = (command) => {
    let newPoints

    switch (command.name) {
      case 'addPointsPlayerOne':
        newPoints = scores.playerOnePoints + command.value
        setScores((prevState) => ({ ...prevState, playerOnePoints: newPoints }))
        break
      case 'addPointsPlayerTwo':
        newPoints = scores.playerTwoPoints + command.value
        setScores((prevState) => ({ ...prevState, playerTwoPoints: newPoints }))
        break

      default:
        break
    }
  }

  const execute = (command) => {
    // Process command.
    processCommand(command)

    // Update undoables.
    let updatedUndoables = [...undoables]
    updatedUndoables.push(command)
    setUndoables(updatedUndoables)

    // Clear redoables.
    setRedoables([])
  }

  const undo = () => {
    let updatedUndoables = [...undoables]

    // Get command to undo.
    const commandToUndo = updatedUndoables.pop()

    // Before continuing, add a copy of this to redoables.
    let updatedRedoables = [...redoables]
    updatedRedoables.push({ ...commandToUndo })
    setRedoables(updatedRedoables)

    // Invert value for command.
    commandToUndo.value = -commandToUndo.value

    // Process inverted command.
    processCommand(commandToUndo)

    // Update undoables collection.
    setUndoables(updatedUndoables)
  }

  const redo = () => {
    let updatedRedoables = [...redoables]

    // Get command to redo.
    const commandToRedo = updatedRedoables.pop()

    // Before continuing, add a copy of this to undoables.
    let updatedUndoables = [...undoables]
    updatedUndoables.push({ ...commandToRedo })
    setUndoables(updatedUndoables)

    // Process command.
    processCommand(commandToRedo)

    // Update redoables collection.
    setRedoables(updatedRedoables)
  }

  return {
    scores,
    execute,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}

export default useScoreTracking
