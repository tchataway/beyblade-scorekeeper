import { useEffect, useState } from 'react'
import * as AppStorage from '../AppStorage'

const DEFAULT_SCORES = {
  playerOneRounds: 0,
  playerOnePoints: 0,
  playerTwoRounds: 0,
  playerTwoPoints: 0,
}

const useScoreTracking = () => {
  const localScores = AppStorage.get('scores')
  const defaultScores = localScores ? JSON.parse(localScores) : DEFAULT_SCORES
  const [scores, setScores] = useState(defaultScores)

  const localUndoables = AppStorage.get('undoables')
  const defaultUndoables = localUndoables ? JSON.parse(localUndoables) : []
  const [undoables, setUndoables] = useState(defaultUndoables)

  const localRedoables = AppStorage.get('redoables')
  const defaultRedoables = localRedoables ? JSON.parse(localRedoables) : []
  const [redoables, setRedoables] = useState(defaultRedoables)

  const [canUndo, setCanUndo] = useState(defaultUndoables.length > 0)
  const [canRedo, setCanRedo] = useState(defaultRedoables.length > 0)

  useEffect(() => {
    setCanUndo(undoables.length > 0)
    setCanRedo(redoables.length > 0)
  }, [undoables, redoables])

  const updateScores = (newScores) => {
    AppStorage.set('scores', JSON.stringify(newScores))
    setScores(newScores)
  }

  const updateUndoables = (newUndoables) => {
    AppStorage.set('undoables', JSON.stringify(newUndoables))
    setUndoables(newUndoables)
  }

  const updateRedoables = (newRedoables) => {
    AppStorage.set('redoables', JSON.stringify(newRedoables))
    setRedoables(newRedoables)
  }

  const processCommand = (command) => {
    let newPoints

    switch (command.name) {
      case 'addPointsPlayerOne':
        newPoints = scores.playerOnePoints + command.value
        updateScores({
          ...scores,
          playerOnePoints: newPoints,
        })
        break

      case 'addPointsPlayerTwo':
        newPoints = scores.playerTwoPoints + command.value
        updateScores({
          ...scores,
          playerTwoPoints: newPoints,
        })
        break

      case 'confirmRoundResult':
        // This action works differently as it
        // impacts multiple states.
        if (command.value === 1) {
          // A value of 1 indicates we are "doing". not
          // "undoing". Cache point totals for later.
          command.payload = {
            playerOneEndofRoundPoints: scores.playerOnePoints,
            playerTwoEndofRoundPoints: scores.playerTwoPoints,
          }

          // Who won?
          let updatedPlayerOneRounds = scores.playerOneRounds
          let updatedPlayerTwoRounds = scores.playerTwoRounds
          if (scores.playerOnePoints > scores.playerTwoPoints) {
            // Add to player one's match score.
            updatedPlayerOneRounds += command.value
          } else if (scores.playerTwoPoints > scores.playerOnePoints) {
            // Add to player one's match score.
            updatedPlayerTwoRounds += command.value
          }

          // Update state.
          updateScores({
            ...scores,
            playerOneRounds: updatedPlayerOneRounds,
            playerTwoRounds: updatedPlayerTwoRounds,
            playerOnePoints: 0,
            playerTwoPoints: 0,
          })
        } else if (command.value === -1) {
          // A value of 1 indicates we are "undoing" a
          // round result. This involves subtracting from
          // one player's rounds total and resetting points
          // to whatever was stored in the command's payload.
          const { playerOneEndofRoundPoints, playerTwoEndofRoundPoints } =
            command.payload

          let updatedPlayerOneRounds = scores.playerOneRounds
          let updatedPlayerTwoRounds = scores.playerTwoRounds

          if (playerOneEndofRoundPoints > playerTwoEndofRoundPoints) {
            // Reduce player one's rounds.
            updatedPlayerOneRounds += command.value
          } else if (playerTwoEndofRoundPoints > playerOneEndofRoundPoints) {
            // Reduce player two's rounds.
            updatedPlayerTwoRounds += command.value
          }

          updateScores({
            ...scores,
            playerOneRounds: updatedPlayerOneRounds,
            playerTwoRounds: updatedPlayerTwoRounds,
            playerOnePoints: playerOneEndofRoundPoints,
            playerTwoPoints: playerTwoEndofRoundPoints,
          })
        }
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
    updateUndoables(updatedUndoables)

    // Clear redoables.
    updateRedoables([])
  }

  const undo = () => {
    let updatedUndoables = [...undoables]

    // Get command to undo.
    const commandToUndo = updatedUndoables.pop()

    // Before continuing, add a copy of this to redoables.
    let updatedRedoables = [...redoables]
    updatedRedoables.push({ ...commandToUndo })
    updateRedoables(updatedRedoables)

    // Invert value for command.
    commandToUndo.value = -commandToUndo.value

    // Process inverted command.
    processCommand(commandToUndo)

    // Update undoables collection.
    updateUndoables(updatedUndoables)
  }

  const redo = () => {
    let updatedRedoables = [...redoables]

    // Get command to redo.
    const commandToRedo = updatedRedoables.pop()

    // Before continuing, add a copy of this to undoables.
    let updatedUndoables = [...undoables]
    updatedUndoables.push({ ...commandToRedo })
    updateUndoables(updatedUndoables)

    // Process command.
    processCommand(commandToRedo)

    // Update redoables collection.
    updateRedoables(updatedRedoables)
  }

  const matchReport = () => {
    const report = []

    // Rounds result.
    report.push(`Rounds`)
    report.push(`${scores.playerOneRounds} - ${scores.playerTwoRounds}`)

    // Points for each round:
    let playerOneTotalPointsScored = 0
    let playerTwoTotalPointsScored = 0
    const roundResults = undoables.filter(
      (command) => command.name === 'confirmRoundResult'
    )
    roundResults.forEach((roundResultCommand, index) => {
      const { playerOneEndofRoundPoints, playerTwoEndofRoundPoints } =
        roundResultCommand.payload
      playerOneTotalPointsScored += playerOneEndofRoundPoints
      playerTwoTotalPointsScored += playerTwoEndofRoundPoints

      report.push(`Round ${index + 1} Points`)
      report.push(`${playerOneEndofRoundPoints} - ${playerTwoEndofRoundPoints}`)
    })

    report.push('Total Points Scored')
    report.push(`${playerOneTotalPointsScored} - ${playerTwoTotalPointsScored}`)

    return report
  }

  const reset = () => {
    updateScores(DEFAULT_SCORES)
    updateUndoables([])
    updateRedoables([])
  }

  return {
    scores,
    execute,
    undo,
    redo,
    canUndo,
    canRedo,
    matchReport,
    reset,
  }
}

export default useScoreTracking
