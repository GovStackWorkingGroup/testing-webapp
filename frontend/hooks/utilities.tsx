import { RefObject } from 'react';
import { ComplianceRequirementsType } from '../service/types';

type focusProps = {
    setIsSelectFocused: (b: boolean) => void;
    ref: RefObject<HTMLDivElement>;
    items:  ComplianceRequirementsType[];
};

export const handleSelectFocus = ({ items, ref, setIsSelectFocused } : focusProps) => {
  setIsSelectFocused(true);
  setTimeout(() => {
    if (items.length === 0) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};
