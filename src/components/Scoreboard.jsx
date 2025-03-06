const Scoreboard = ({ player1Scores, player2Scores }) => {
  const { rounds: player1Rounds, points: player1Points } = player1Scores
  const { rounds: player2Rounds, points: player2Points } = player2Scores

  return (
    <>
      <div className='backgroundX' />
      <div className='matchScores'>
        <h1>
          {player1Rounds} - {player2Rounds}
        </h1>
      </div>
      <div className='roundScoresContainer'>
        <div className='roundScores'>
          <h1>{player1Points}</h1>
          <h1>{player2Points}</h1>
        </div>
      </div>
    </>
  )
}

export default Scoreboard
