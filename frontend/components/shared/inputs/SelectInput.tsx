import React from 'react';
import classNames from 'classnames';
import AsyncSelect from 'react-select/async';
import { GroupBase, OptionsOrGroups } from 'react-select';
import { InputOptionsProps } from '../../../service/types';

type SelectProps = {
  onChange: (args0: any) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder: string;
  className?: string;
  options:
    | OptionsOrGroups<InputOptionsProps[], GroupBase<InputOptionsProps[]>>
    | undefined;
  handleSetOptions: () => void;
};

const SelectInput = ({
  onBlur,
  onFocus,
  placeholder,
  className,
  onChange,
  options,
  handleSetOptions,
  ...otherProps
}: SelectProps) => {
  return (
    <AsyncSelect
      {...otherProps}
      defaultOptions={options}
      placeholder={placeholder}
      loadOptions={() => handleSetOptions()}
      onChange={(newValue: any) => onChange(newValue)}
      onBlur={onBlur}
      classNamePrefix="react-select"
      className={classNames(className)}
      onFocus={onFocus}
    />
  );
};

export default SelectInput;
