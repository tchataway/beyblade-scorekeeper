import { useRef, useState } from 'react'

const SettingsForm = ({ defaultOptions, onSubmit }) => {
  const [settingsData, setSettingsData] = useState({
    pointsPerRound: defaultOptions.pointsPerRound,
    roundsPerMatch: defaultOptions.roundsPerMatch,
  })
  const pointsPerRoundRef = useRef(null)
  const roundsPerMatchRef = useRef(null)
  const { pointsPerRound, roundsPerMatch } = settingsData

  const handleFormChange = (e) => {
    setSettingsData((prevState) => ({
      ...prevState,
      [e.target.id]: Number(e.target.value),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    onSubmit(settingsData)
  }

  const handleNewMatch = () => {
    onSubmit({ newMatch: true })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='settingsFormItem'>
        <label htmlFor='pointsPerRound'>Points per round</label>
        <input
          id='pointsPerRound'
          type='number'
          min='1'
          value={pointsPerRound}
          onChange={handleFormChange}
          className='input'
          ref={pointsPerRoundRef}
          onFocus={() => {
            pointsPerRoundRef.current.select()
          }}
        />
      </div>
      <div className='settingsFormItem'>
        <label htmlFor='roundsPerMatch'>Rounds per match</label>
        <input
          id='roundsPerMatch'
          type='number'
          min='1'
          value={roundsPerMatch}
          onChange={handleFormChange}
          className='input'
          ref={roundsPerMatchRef}
          onFocus={() => {
            roundsPerMatchRef.current.select()
          }}
        />
      </div>
      <div className='modalButtons'>
        <button type='submit' className='button buttonPrimary'>
          Confirm
        </button>
        <button className='button buttonDanger' onClick={handleNewMatch}>
          New Match
        </button>
      </div>
    </form>
  )
}

export default SettingsForm
