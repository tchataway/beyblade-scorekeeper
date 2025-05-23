import { useState } from 'react'
import Modal from './Modal'
import SettingsForm from './SettingsForm'

const Options = ({ undoAndRedo, currentOptions, onOptionsChanged }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [settingsKey, setSettingsKey] = useState(false)

  const { undo, canUndo, redo, canRedo } = undoAndRedo

  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const handleSubmit = (newOptions) => {
    onOptionsChanged(newOptions)
    closeModal()
  }

  return (
    <>
      <div className='optionsContainer'>
        <div className='options'>
          <button className='button' disabled={!canUndo} onClick={undo}>
            <i className='material-icons' style={{ fontSize: '36px' }}>
              undo
            </i>
          </button>
          <button className='button' onClick={openModal}>
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
      <Modal
        header='Options'
        isOpen={modalIsOpen}
        closeModal={() => {
          setSettingsKey((prevState) => !prevState) // Trick to reset SettingsForm to default values.
          closeModal()
        }}
      >
        <SettingsForm
          key={settingsKey}
          defaultOptions={currentOptions}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  )
}

export default Options
