import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import appVersion from '../utilities/appVersion'

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

    if (settingsData.pointsPerRound <= 0) {
      toast.error('Points per round must be greater than 0')
      return
    }

    if (settingsData.roundsPerMatch <= 0) {
      toast.error('Rounds per match must be greater than 0')
      return
    }

    onSubmit(settingsData)
  }

  const handleNewMatch = () => {
    onSubmit({ newMatch: true })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='settingsFormItem'>
        <label htmlFor='pointsPerRound' className='modalText'>
          Points per round
        </label>
        <input
          id='pointsPerRound'
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
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
        <label htmlFor='roundsPerMatch' className='modalText'>
          Rounds per match
        </label>
        <input
          id='roundsPerMatch'
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
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
      <div className='appVersion'>App Version: v{appVersion()}</div>
    </form>
  )
}

export default SettingsForm
