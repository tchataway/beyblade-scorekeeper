import { useRef } from 'react'
import useOutsideDetection from '../hooks/useOutsideDetection'
import SettingsForm from './SettingsForm'

const Modal = ({ header, isOpen, closeModal, children }) => {
  const containerRef = useRef(null)
  useOutsideDetection(containerRef, closeModal)

  const modalDisplay = isOpen ? 'block' : 'none'

  return (
    <div className='modal' style={{ display: modalDisplay }}>
      <div className='modal-content' ref={containerRef}>
        <span className='close' onClick={closeModal}>
          &times;
        </span>
        <h3 className='modalHeader'>{header}</h3>
        <div className='modalContainer'>{children}</div>
      </div>
    </div>
  )
}

export default Modal
