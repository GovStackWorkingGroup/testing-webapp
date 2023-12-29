import React, { useState, useEffect } from 'react';
import Select, { components, MultiValue } from 'react-select';
import { useIntl } from 'react-intl';
import useTranslations from '../../../hooks/useTranslation';
import Checkbox from './Checkbox';

interface OptionType {
  value: string;
  label: string;
  isFixed?: boolean;
}

interface VersionType {
  [key: string]: OptionType[];
}

interface MultiSelectDropdownProps {
  onChange: (selectedItems: string[]) => void;
  placeholder: string;
  availableItems: OptionType[];
  availableVersions: VersionType;
}

interface InnerOptionContainerProps {
  getStyles: any;
  isSelected: boolean;
  label: string;
  value: string;
  onChange: () => void;
}

interface BlueCircle {
  number: string | number;
}

interface DropdownInputOptionProps {
  getStyles: any;
  Icon?: React.ComponentType;
  isDisabled: boolean;
  isFocused: boolean;
  isSelected: boolean;
  children: React.ReactNode;
  innerProps: any;
  versions: VersionType;
  selectProps: any;
  getValue: () => OptionType[];
}

const InnerOptionContainer: React.FC<InnerOptionContainerProps> = ({
  getStyles,
  isSelected,
  label,
  value,
  onChange,
  ...rest
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return     <div
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    onMouseDown={onChange}
  >
    {/* @ts-ignore */}
    <components.Option
      key={value}
      isSelected={isSelected}
      getStyles={getStyles}
      isFocused={isHovering}
      {...rest}
    ><Checkbox
        key={value}
        label={label}
        checked={isSelected}
        className="checkbox-square"
      />
    </components.Option>
  </div>;
};

const DropdownInputOption: React.FC<DropdownInputOptionProps> = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  versions,
  ...rest
}) => {

  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  // prop assignment
  const props = {
    ...innerProps,
  };
  const { formatMessage } = useIntl();
  const format = React.useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  const toggleVersion = (version: any) => {
    setSelectedVersions(prev => {
      if (prev.includes(version)) {
        return prev.filter(v => v !== version);
      } else {
        return [...prev, version];
      }
    });
  };

  useEffect(() => {
    if (rest.getValue()?.length !== 0) {
      rest.selectProps.onSelect(children, selectedVersions);
    }
  }, [selectedVersions]);

  return (
    <div>
      {/* @ts-ignore */}
      <components.Option
        {...rest}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isSelected={isSelected}
        getStyles={getStyles}
        innerProps={props}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}> {/* Flex container */}
          <div style={{ display: 'flex', alignItems: 'center' }}> {/* Flex item: Checkbox + Label */}
            <Checkbox
              key={children as string}
              label={format(children as string)}
              checked={isSelected}
              className="checkbox-square"
            />
          </div>
        </div>
      </components.Option>
      {isSelected && (
        <div style={{ marginLeft: '20px' }}>
          {rest.selectProps.versions[children as string].map((version: OptionType) => {
            return <InnerOptionContainer
              {...rest}
              key={version.value}
              getStyles={getStyles}
              value={version.value}
              isSelected={selectedVersions.includes(version.value)}
              label={version.label}
              onChange={() => toggleVersion(version.value)}
            />;
          })}
        </div>
      )}
    </div>
  );
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  onChange, placeholder, availableItems, availableVersions
}) => {
  const [items, setItems] = useState<OptionType[]>([]);
  const [versions, setVersions] = useState<{ [key: string]: OptionType[] }>({});
  const [selection, setSelection] = useState([]);
  const [versionSelection, setVersionSelection] = useState({});

  const onChangeCallback = React.useCallback((items: any) => {
    onChange(items);
  }, [versionSelection,onChange]);

  useEffect(() => {
    setItems(availableItems);
    setVersions(availableVersions);
  }, [availableItems, availableVersions]);

  useEffect(() => {
    const newObj = {};
    selection.map((x: string) => {
      (newObj as any)[x] = (versionSelection as never)[x] ?  (versionSelection as never)[x] : [] ;

    });
    onChangeCallback(newObj);
  }, [selection, versionSelection]);

  const { format } = useTranslations();

  const toggleSelection = (item: never, versions: never) => {
    setVersionSelection(
      prev => {
        const newVersionSelection =  Object.keys(prev).reduce((newObj, key) => {
          if ((selection.includes(key as never))) {
            (newObj as never)[key] = (prev as never)[key];
          }

          return newObj;
        }, {});

        newVersionSelection[item] = versions;

        return newVersionSelection;
      }
    );

  };

  const selectItems = (items: MultiValue<OptionType>) => {
    setSelection(() => {
      return items.map((x) => x.value as never);
    });
  };

  const selectorstyle = {    control: (baseStyles: any) => ({
    ...baseStyles,
    width: 200,
    border: 10,
    fontSize: 12
  }) };

  const BlueCircle: React.FC<BlueCircle> = ({ number }) => {
    return (
      <div className="dropdown-circle">
        {number}
      </div>
    );
  };

  const Placeholder = (props: any) => {
    return (
      <>
        <components.Placeholder {...props}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent:' space-between' }}>
            {format('select.label')} {props.selectProps.placeholder} <BlueCircle number={selection.length} />
          </span>
        </components.Placeholder>
      </>
    );
  };

  return (
    <>
      <div>
        <span className='custom-input-tip-message'>{format('filter_by.label')} {placeholder}</span>
        <Select
          className='dropdown-filter'
          closeMenuOnSelect={false}
          controlShouldRenderValue={false}
          isMulti
          hideSelectedOptions={false}
          /* @ts-ignore */
          components={{ Option: DropdownInputOption, Placeholder }}
          /* @ts-ignore */
          versions={versions as unknown}
          onSelect={toggleSelection}
          options={items}
          placeholder={placeholder}
          styles={selectorstyle}
          onChange={selectItems}
          isClearable={false}
        />
      </div>
    </>

  );
};

export default MultiSelectDropdown;
