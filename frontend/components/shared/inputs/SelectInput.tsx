import React from 'react';
import classNames from 'classnames';
import AsyncSelect from 'react-select/async';
import { InputOptionsProps } from '../../../service/types';

type SelectProps = {
  onChange: (args0: never) => void,
  onBlur?: () => void,
  placeholder: string,
  className?: string,
  options: InputOptionsProps | undefined,
  handleSetOptions: () => void,
}

const SelectInput = ({
  onBlur,
  placeholder,
  className,
  onChange,
  options,
  handleSetOptions,
  ...otherProps
} : SelectProps) => {

  return (
    <AsyncSelect
      {...otherProps}
      defaultOptions={options}
      placeholder={placeholder}
      loadOptions={() => handleSetOptions()}
      onChange={(newValue: never) => onChange(newValue)}
      onBlur={onBlur}
      classNamePrefix='react-select'
      className={classNames(className)}
    />
  );
};

export default SelectInput;
