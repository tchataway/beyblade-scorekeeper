import { useState } from 'react'
import Scoreboard from './components/Scoreboard'
import ScoreControls from './components/ScoreControls'

function App() {
  const [player1Rounds, setPlayer1Rounds] = useState(0)
  const [player2Rounds, setPlayer2Rounds] = useState(0)
  const [player1Points, setPlayer1Points] = useState(0)
  const [player2Points, setPlayer2Points] = useState(0)

  const player1Scores = {
    rounds: player1Rounds,
    points: player1Points,
  }
  const player2Scores = {
    rounds: player2Rounds,
    points: player2Points,
  }

  const handlePlayer1Score = (points) => {
    setPlayer1Points((prevState) => prevState + points)
  }

  const handlePlayer2Score = (points) => {
    setPlayer2Points((prevState) => prevState + points)
  }

  return (
    <>
      <div className='backgroundX' />
      <Scoreboard player1Scores={player1Scores} player2Scores={player2Scores} />
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
