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
          setScores((prevState) => ({
            ...prevState,
            playerOneRounds: updatedPlayerOneRounds,
            playerTwoRounds: updatedPlayerTwoRounds,
            playerOnePoints: 0,
            playerTwoPoints: 0,
          }))
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

          setScores((prevState) => ({
            ...prevState,
            playerOneRounds: updatedPlayerOneRounds,
            playerTwoRounds: updatedPlayerTwoRounds,
            playerOnePoints: playerOneEndofRoundPoints,
            playerTwoPoints: playerTwoEndofRoundPoints,
          }))
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
    setScores({
      playerOneRounds: 0,
      playerOnePoints: 0,
      playerTwoRounds: 0,
      playerTwoPoints: 0,
    })
    setUndoables([])
    setRedoables([])
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
