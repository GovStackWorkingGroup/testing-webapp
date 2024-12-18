import React from 'react';
import Select, { SingleValue } from 'react-select';
import { formatTranslationType } from '../../../service/types';

export type OptionsType = { value: string; label: formatTranslationType };

type SelectProps = {
  onChange: (args0: SingleValue<OptionsType>) => void;
  placeholder: formatTranslationType;
  options: OptionsType[];
  value: SingleValue<OptionsType>;
  isDisabled?: boolean;
};

const CustomSelect = ({
  placeholder,
  onChange,
  options,
  value,
  isDisabled = false,
  ...otherProps
}: SelectProps) => {
  return (
    <Select
      {...otherProps}
      placeholder={placeholder}
      onChange={(newValue: SingleValue<OptionsType>) => onChange(newValue)}
      classNamePrefix="react-select"
      value={value}
      isDisabled={isDisabled}
      classNames={{
        valueContainer: () => 'search-value-container',
        placeholder: () => 'search-placeholder',
        container: () => 'custom-select-container',
        menuList: () => 'select-menu-list',
        option: () => 'select-option',
        input: () => 'search-input',
        menu: () => 'search-menu',
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
      options={options}
    />
  );
};

export default CustomSelect;
