import React from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { formatTranslationType } from '../../../service/types';

type ModalProps = {
  modalTitle: formatTranslationType;
  onClose: () => void;
  children: React.ReactNode;
};

const InfoModal = ({ modalTitle, onClose, children }: ModalProps) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-title-section">
          <p>{modalTitle}</p>
          <div className="modal-close-container">
            <RiCloseFill className="modal-close-icon" onClick={onClose} />
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default InfoModal;
