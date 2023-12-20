import React from 'react';
import Select, { SingleValue } from 'react-select';

export type OptionsType = { value: string; label: string };

type SelectProps = {
  onChange: (args0: SingleValue<OptionsType>) => void;
  placeholder: string;
  options: OptionsType[];
};

const CustomSelect = ({
  placeholder,
  onChange,
  options,
  ...otherProps
}: SelectProps) => {
  return (
    <Select
      {...otherProps}
      placeholder={placeholder}
      onChange={(newValue: SingleValue<OptionsType>) => onChange(newValue)}
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
