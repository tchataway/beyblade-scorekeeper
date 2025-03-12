import { useRef } from 'react'
import usePlayerName from '../hooks/usePlayerName'

const PlayerNames = ({ scoreControlsLeftRef, scoreControlsRightRef }) => {
  const bladerTwoNameRef = useRef()
  const bladerTwoNameEntryRef = useRef()

  const bladerOneNameRef = useRef()
  const bladerOneNameEntryRef = useRef()

  const {
    bladerName: bladerOneName,
    setBladerName: setBladerOneName,
    bladerNameEntryWidth: bladerOneNameEntryWidth,
    fontSize: bladerOneFontSize,
    editingBlader: editingBladerOne,
    setEditingBlader: setEditingBladerOne,
    handleBladerEntryKeyUp: handleBladerOneEntryKeyUp,
  } = usePlayerName(
    'Blader 1',
    48,
    6,
    bladerOneNameRef,
    bladerOneNameEntryRef,
    scoreControlsLeftRef,
    'left'
  )

  const {
    bladerName: bladerTwoName,
    setBladerName: setBladerTwoName,
    bladerNameEntryWidth: bladerTwoNameEntryWidth,
    fontSize: bladerTwoFontSize,
    editingBlader: editingBladerTwo,
    setEditingBlader: setEditingBladerTwo,
    handleBladerEntryKeyUp: handleBladerTwoEntryKeyUp,
  } = usePlayerName(
    'Blader 2',
    48,
    6,
    bladerTwoNameRef,
    bladerTwoNameEntryRef,
    scoreControlsRightRef,
    'right'
  )

  return (
    <div className='playerNames'>
      <div className='playerNameContainer'>
        {!editingBladerOne && (
          <h1
            className='playerName'
            ref={bladerOneNameRef}
            style={{ fontSize: `${bladerOneFontSize}px`, marginLeft: 'auto' }}
            onClick={() => {
              setEditingBladerOne(true)
            }}
          >
            {bladerOneName}
          </h1>
        )}
        {editingBladerOne && (
          <>
            <input
              ref={bladerOneNameEntryRef}
              value={bladerOneName}
              onChange={(e) => setBladerOneName(e.target.value)}
              onKeyUp={handleBladerOneEntryKeyUp}
              style={{
                fontSize: `${bladerOneFontSize}px`,
                width: `${bladerOneNameEntryWidth}ch`,
                marginLeft: 'auto',
              }}
              type='text'
              className='playerNameEntry'
            />
          </>
        )}
      </div>
      <div className='playerNameContainer'>
        {!editingBladerTwo && (
          <h1
            className='playerName'
            ref={bladerTwoNameRef}
            style={{ fontSize: `${bladerTwoFontSize}px`, marginRight: 'auto' }}
            onClick={() => {
              setEditingBladerTwo(true)
            }}
          >
            {bladerTwoName}
          </h1>
        )}
        {editingBladerTwo && (
          <>
            <input
              ref={bladerTwoNameEntryRef}
              value={bladerTwoName}
              onChange={(e) => setBladerTwoName(e.target.value)}
              onKeyUp={handleBladerTwoEntryKeyUp}
              style={{
                fontSize: `${bladerTwoFontSize}px`,
                width: `${bladerTwoNameEntryWidth}ch`,
                marginRight: 'auto',
              }}
              type='text'
              className='playerNameEntry'
            />
          </>
        )}
      </div>
    </div>
  )
}

export default PlayerNames
