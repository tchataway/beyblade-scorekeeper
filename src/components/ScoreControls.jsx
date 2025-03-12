// It's just some buttons, really.
const ScoreControls = ({
  ref,
  side,
  onBurst,
  onSpin,
  onXtreme,
  onOver,
  lockControls,
}) => {
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
    <div ref={ref} className={`scoreControlsContainer ${position}`}>
      <button
        className={`scoreButton spin ${rotation}`}
        onClick={onSpin}
        disabled={lockControls}
      >
        S
      </button>
      <button
        className={`scoreButton burst ${rotation}`}
        onClick={onBurst}
        disabled={lockControls}
      >
        B
      </button>
      <button
        className={`scoreButton xtreme ${rotation}`}
        onClick={onXtreme}
        disabled={lockControls}
      >
        X
      </button>
      <button
        className={`scoreButton over ${rotation}`}
        onClick={onOver}
        disabled={lockControls}
      >
        O
      </button>
    </div>
  )
}

export default ScoreControls
