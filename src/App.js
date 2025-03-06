import { useEffect, useState } from 'react'
import Scoreboard from './components/Scoreboard'
import ScoreControls from './components/ScoreControls'
import useScoreTracking from './hooks/useScoreTracking'
import Options from './components/Options'
import Modal from './components/Modal'

function App() {
  const { scores, execute, undo, redo, canUndo, canRedo, matchReport, reset } =
    useScoreTracking()
  const [gameSettings, setGameSettings] = useState({
    pointsPerRound: 5,
    roundsPerMatch: 3,
  })
  const [roundEndConfirmation, setRoundEndConfirmation] = useState(false)
  const [showMatchResultModal, setShowMatchResultModal] = useState(false)
  const [matchOver, setMatchOver] = useState(false)

  const { playerOnePoints, playerOneRounds, playerTwoPoints, playerTwoRounds } =
    scores

  const player1Scores = {
    rounds: playerOneRounds,
    points: playerOnePoints,
  }
  const player2Scores = {
    rounds: playerTwoRounds,
    points: playerTwoPoints,
  }

  const undoAndRedo = {
    undo,
    canUndo,
    redo,
    canRedo,
  }

  // Update UI on score changes.
  useEffect(() => {
    // Check if round is over.
    const highestScore = Math.max(playerOnePoints, playerTwoPoints)

    if (highestScore < gameSettings.pointsPerRound) {
      // Scores aren't high enough to end the
      // round yet.
      setRoundEndConfirmation(false)
      return
    }

    setRoundEndConfirmation(true)
  }, [playerOnePoints, playerTwoPoints, gameSettings])

  useEffect(() => {
    // Check if match is over.
    const highestRounds = Math.max(playerOneRounds, playerTwoRounds)

    if (highestRounds < gameSettings.roundsPerMatch / 2) {
      // Not enough rounds won yet.
      setMatchOver(false)
      return
    }

    setMatchOver(true)
  }, [playerOneRounds, playerTwoRounds, gameSettings])

  // Match over modal.
  useEffect(() => {
    if (matchOver) {
      setShowMatchResultModal(true)
    } else {
      setShowMatchResultModal(false)
    }
  }, [matchOver])

  const handlePlayer1Score = (points) => {
    execute({
      name: 'addPointsPlayerOne',
      value: points,
    })
  }

  const handlePlayer2Score = (points) => {
    execute({
      name: 'addPointsPlayerTwo',
      value: points,
    })
  }

  const handleOptionsChanged = (newOptions) => {
    if (newOptions.newMatch) {
      reset()
      return
    }

    setGameSettings(newOptions)
  }

  const handleRoundEndConfirmation = () => {
    execute({
      name: 'confirmRoundResult',
      value: 1,
    })
  }

  const handleNewMatch = () => {
    reset()
  }

  const xStyling =
    roundEndConfirmation || matchOver ? 'backgroundX redX' : 'backgroundX'

  return (
    <>
      <div className={xStyling} />
      <Scoreboard
        player1Scores={player1Scores}
        player2Scores={player2Scores}
        fade={roundEndConfirmation || matchOver}
      />
      <Options
        undoAndRedo={undoAndRedo}
        onOptionsChanged={handleOptionsChanged}
        currentOptions={gameSettings}
      />
      <ScoreControls
        side='left'
        onBurst={() => handlePlayer1Score(2)}
        onSpin={() => handlePlayer1Score(1)}
        onXtreme={() => handlePlayer1Score(3)}
        onOver={() => handlePlayer1Score(2)}
        lockControls={roundEndConfirmation || matchOver}
      />
      <ScoreControls
        side='right'
        onBurst={() => handlePlayer2Score(2)}
        onSpin={() => handlePlayer2Score(1)}
        onXtreme={() => handlePlayer2Score(3)}
        onOver={() => handlePlayer2Score(2)}
        lockControls={roundEndConfirmation || matchOver}
      />
      {roundEndConfirmation && (
        <div className='roundEndControls'>
          <button
            className='button buttonPrimary'
            onClick={handleRoundEndConfirmation}
          >
            Confirm Round Result
          </button>
        </div>
      )}
      <Modal
        header='Match Complete'
        isOpen={showMatchResultModal}
        closeModal={() => setShowMatchResultModal(false)}
      >
        <div
          style={{ textAlign: 'center', overflow: 'auto', maxHeight: '180px' }}
        >
          {matchReport().map((reportLine, index) => (
            <div key={index}>{reportLine}</div>
          ))}
        </div>
        <div className='modalButtons'>
          <button className='buttonPrimary' onClick={handleNewMatch}>
            New Match
          </button>
        </div>
      </Modal>
    </>
  )
}

export default App
