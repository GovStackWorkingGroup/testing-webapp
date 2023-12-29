import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import { useIntl } from 'react-intl';
import { getFilters } from '../../../service/serviceAPI';
import { FilterOptionsType } from '../../../service/types';
import Checkbox from './Checkbox';
import useTranslations from '../../../hooks/useTranslation';

interface MultiSelectDropdownProps {
  onChange: (arg0: any) => void;
  placeholder: string;
  availableItems: OptionType[];
  availableVersions: { [key: string]: OptionType[] }
}

interface OptionType {
  value: string;
  label: string;
  isFixed?: boolean;
}

const InnerOptionContainer = ({
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

const InputOption1 = ({
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
  // const [isActive, setIsActive] = useState(false);
  // const onMouseDown = () => setIsActive(true);
  // const onMouseUp = () => setIsActive(false);
  // const onMouseLeave = () => setIsActive(false);
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

  const toggleVersion = (version) => {
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
  }, [selectedVersions, rest.getValue()]);

  return (
    <div>
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
              key={children}
              label={format(children)}
              checked={isSelected}
              className="checkbox-square"
            />
          </div>
        </div>
      </components.Option>
      {isSelected && (
        <div style={{ marginLeft: '20px' }}>
          {rest.selectProps.versions[children].map(version => {
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
  }, [onChange]);

  useEffect(() => {
    setItems(availableItems);
    setVersions(availableVersions);
  }, [availableItems, availableVersions]);

  useEffect(() => {
    if (selection) {
      onChangeCallback(versionSelection);
    }
  }, [versionSelection, onChangeCallback]);
  const { format } = useTranslations();

  const toggleSelection = (item, versions) => {
    if (selection.includes(item)) {
      setVersionSelection(
        prev => {
          const newVersionSelection =  Object.keys(prev).reduce((newObj, key) => {
            if ((selection.includes(key))) {
              newObj[key] = prev[key];
            }

            return newObj;
          }, {});

          newVersionSelection[item] = versions;

          return newVersionSelection;
        }
      );
    }
  };

  const selectItems = (items) => {
    setSelection(prev => {
      return items.map((x) => x.value);
    });
  };

  const style1 = {    control: (baseStyles, state) => ({
    // none of react-select's styles are passed to <Control />
    ...baseStyles,
    width: 200,
    border: 10,
    fontSize: 12
  }) };

  const BlueCircle = ({ number }) => {
    return (
      <div className="dropdown-circle">
        {number}
      </div>
    );
  };

  const Placeholder = (props) => {
    return (
      <>
        <components.Placeholder {...props}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent:' space-between'}}>
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
          components={{ Option: InputOption1, Placeholder }}
          versions={versions}
          onSelect={toggleSelection}
          options={items}
          placeholder={placeholder}
          styles={style1}
          onChange={selectItems}
          isClearable={false}
        />
      </div>
    </>

  );
};

export default MultiSelectDropdown;
