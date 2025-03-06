import { useState } from 'react'
import Scoreboard from './components/Scoreboard'
import ScoreControls from './components/ScoreControls'
import useScoreTracking from './hooks/useScoreTracking'

function App() {
  const { scores, execute, undo, redo, canUndo, canRedo } = useScoreTracking()
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

  return (
    <>
      <div className='backgroundX' />
      <Scoreboard player1Scores={player1Scores} player2Scores={player2Scores} />
      <div className='optionsContainer'>
        <div className='options'>
          <button className='button' disabled={!canUndo} onClick={undo}>
            <i className='material-icons' style={{ fontSize: '36px' }}>
              undo
            </i>
          </button>
          <button className='button'>
            <i className='material-icons' style={{ fontSize: '36px' }}>
              settings
            </i>
          </button>
          <button className='button' disabled={!canRedo} onClick={redo}>
            <i className='material-icons' style={{ fontSize: '36px' }}>
              redo
            </i>
          </button>
        </div>
      </div>
      <ScoreControls
        side='left'
        onBurst={() => handlePlayer1Score(2)}
        onSpin={() => handlePlayer1Score(1)}
        onXtreme={() => handlePlayer1Score(3)}
        onOver={() => handlePlayer1Score(2)}
      />
      <ScoreControls
        side='right'
        onBurst={() => handlePlayer2Score(2)}
        onSpin={() => handlePlayer2Score(1)}
        onXtreme={() => handlePlayer2Score(3)}
        onOver={() => handlePlayer2Score(2)}
      />
    </>
  )
}

export default App
