import React from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { formatTranslationType } from '../../../service/types';

type ModalProps = {
  title: formatTranslationType;
  onClose: () => void;
  children: React.ReactNode;
};

const ConfirmModal: React.FC<ModalProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <div className='modal-overlay'>
      <div className='modal-container'>
        <div className='modal-title-section'>
          <p>{title}</p>
          <div className='modal-close-container'>
            <RiCloseFill className='modal-close-icon' onClick={onClose} />
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ConfirmModal;
