import React from 'react';
import ReactModal from 'react-modal';
import CloseIcon from './CloseIcon';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    maxWidth: '400px',
    minHeight: '400px',
    width: '100%',
    backgroundColor: '#fffbeb',
    maxHeight: '80vh',

    padding: '20px 20px 0 20px',
  },
};

interface Props {
  isOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  onAfterOpen?: () => void;
}

const Modal = ({ isOpen, setModalOpen, children, onAfterOpen }: Props) => {
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        onAfterOpen={onAfterOpen}>
        <button
          className="absolute top-5 right-5 text-xs z-10"
          onClick={closeModal}>
          <span className="w-[30px] h-[30px] block text-gray-600">
            <CloseIcon />
          </span>
        </button>
        <div className="h-full mt-8 relative min-h-[400px]">{children}</div>
      </ReactModal>
    </div>
  );
};

export default Modal;
