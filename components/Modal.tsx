import React from 'react';
import ReactModal from 'react-modal';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '400px',
    width: '100%',
    backgroundColor: '#fffbeb',
    maxHeight: '80vh',
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
          className="bg-slate-600 hover:bg-slate-700 text-white text-small absolute px-2 border rounded-lg right-5"
          onClick={closeModal}>
          close
        </button>
        <div className="mt-12">{children}</div>
      </ReactModal>
    </div>
  );
};

export default Modal;
