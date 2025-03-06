// It's just some buttons, really.
const ScoreControls = ({ side, onBurst, onSpin, onXtreme, onOver }) => {
  let rotation,
    position = ''

  switch (side) {
    case 'right':
      position = 'positionForRight'
      rotation = 'rotateForRight'
      break
    case 'left':
      position = 'positionForLeft'
      rotation = 'rotateForLeft'

    default:
      break
  }

  return (
    <div className={`scoreControlsContainer ${position}`}>
      <button className={`scoreButton burst ${rotation}`} onClick={onBurst}>
        B
      </button>
      <button className={`scoreButton spin ${rotation}`} onClick={onSpin}>
        S
      </button>
      <button className={`scoreButton xtreme ${rotation}`} onClick={onXtreme}>
        X
      </button>
      <button className={`scoreButton over ${rotation}`} onClick={onOver}>
        O
      </button>
    </div>
  )
}

export default ScoreControls
