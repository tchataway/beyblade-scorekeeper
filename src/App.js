import { useEffect, useRef, useState } from 'react'
import Scoreboard from './components/Scoreboard'
import ScoreControls from './components/ScoreControls'
import useScoreTracking from './hooks/useScoreTracking'
import Options from './components/Options'
import Modal from './components/Modal'
import { ToastContainer } from 'react-toastify'
import PlayerNames from './components/PlayerNames'
import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings'
import * as AppStorage from './AppStorage'

const DEFAULT_GAME_SETTINGS = {
  pointsPerRound: 5,
  roundsPerMatch: 3,
  showPlayerNames: false,
}

function App() {
  const { client } = useClientAsyncInit(
    process.env.REACT_APP_NEXT_PUBLIC_STATSIG_CLIENT_KEY,
    { userID: 'default' }
  )
  const scoreControlsLeftRef = useRef()
  const scoreControlsRightRef = useRef()
  const { scores, execute, undo, redo, canUndo, canRedo, matchReport, reset } =
    useScoreTracking()
  const localSettings = AppStorage.get('settings')
  const defaultSettings = localSettings
    ? JSON.parse(localSettings)
    : DEFAULT_GAME_SETTINGS
  const [gameSettings, setGameSettings] = useState(defaultSettings)

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

  const lockControls = roundEndConfirmation || matchOver
  const xStyling = lockControls ? 'backgroundX redX' : 'backgroundX'

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

    // Update localStorage.
    AppStorage.set('settings', JSON.stringify(newOptions))

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

  return (
    <StatsigProvider client={client}>
      <div className={xStyling} />
      <Scoreboard
        player1Scores={player1Scores}
        player2Scores={player2Scores}
        fade={lockControls}
      />
      {gameSettings.showPlayerNames && (
        <PlayerNames
          scoreControlsLeftRef={scoreControlsLeftRef}
          scoreControlsRightRef={scoreControlsRightRef}
        />
      )}
      <ScoreControls
        ref={scoreControlsLeftRef}
        side='left'
        onBurst={() => handlePlayer1Score(2)}
        onSpin={() => handlePlayer1Score(1)}
        onXtreme={() => handlePlayer1Score(3)}
        onOver={() => handlePlayer1Score(2)}
        lockControls={lockControls}
      />
      <ScoreControls
        ref={scoreControlsRightRef}
        side='right'
        onBurst={() => handlePlayer2Score(2)}
        onSpin={() => handlePlayer2Score(1)}
        onXtreme={() => handlePlayer2Score(3)}
        onOver={() => handlePlayer2Score(2)}
        lockControls={lockControls}
      />
      {lockControls && <div className='lockOverlay' />}
      <Options
        undoAndRedo={undoAndRedo}
        onOptionsChanged={handleOptionsChanged}
        currentOptions={gameSettings}
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
        <div className='modalBody'>
          <div className='modalVariableSizeContainer matchReport'>
            {matchReport().map((reportLine, index) => (
              <div key={index}>{reportLine}</div>
            ))}
          </div>
          <div className='modalButtons'>
            <button className='buttonPrimary' onClick={handleNewMatch}>
              New Match
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </StatsigProvider>
  )
}

export default App
