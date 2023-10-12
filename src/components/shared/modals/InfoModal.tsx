import React from 'react';
import { RiCloseFill } from 'react-icons/ri';

type ModalProps = {
  modalTitle: string;
  children: React.ReactNode;
};

const InfoModal = ({ modalTitle, children }: ModalProps) => {
  return (
    <div>
      <div>
        <p>{modalTitle}</p>
        <RiCloseFill onClick={() => {}} />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default InfoModal;
