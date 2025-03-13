import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import appVersion from '../utilities/appVersion'
import ToggleSwitch from './ToggleSwitch'
import useFlag from '../hooks/useFlag'

const SettingsForm = ({ defaultOptions, onSubmit }) => {
  const [settingsData, setSettingsData] = useState({
    pointsPerRound: defaultOptions.pointsPerRound,
    roundsPerMatch: defaultOptions.roundsPerMatch,
    showPlayerNames: defaultOptions.showPlayerNames,
  })
  const pointsPerRoundRef = useRef(null)
  const roundsPerMatchRef = useRef(null)
  const testFlagValue = useFlag('my_first_gate')
  const { pointsPerRound, roundsPerMatch, showPlayerNames } = settingsData

  const handleFormChange = (e) => {
    // Maybe cast boolean text to nullable boolean.
    let nullableBoolean = null
    if (e.target.value === 'true') {
      nullableBoolean = true
    } else if (e.target.value === 'false') {
      nullableBoolean = false
    }

    setSettingsData((prevState) => ({
      ...prevState,
      [e.target.id]: nullableBoolean ?? Number(e.target.value),
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
    <form onSubmit={handleSubmit} className='modalBody'>
      <div className='modalVariableSizeContainer'>
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
        <div className='settingsFormItem'>
          <label htmlFor='showPlayerNames' className='modalText'>
            Show blader names
          </label>
          <ToggleSwitch
            isChecked={showPlayerNames}
            onChange={() =>
              setSettingsData((prevState) => ({
                ...prevState,
                showPlayerNames: !prevState.showPlayerNames,
              }))
            }
          />
        </div>
      </div>
      <div className='modalButtons'>
        <button type='submit' className='button buttonPrimary'>
          Confirm
        </button>
        <button className='button buttonDanger' onClick={handleNewMatch}>
          New Match
        </button>
      </div>
      <div className='appVersion'>
        {testFlagValue ? `${appVersion()}` : `App Version: v${appVersion()}`}
      </div>
    </form>
  )
}

export default SettingsForm
