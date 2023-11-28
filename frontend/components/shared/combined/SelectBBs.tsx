import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Pill from '../Pill';
import SelectInput from '../inputs/SelectInput';
import { ComplianceRequirementsType, InputSingleOptionProps } from '../../../service/types';
import Input from '../inputs/Input';
import IRSCTable, { RequirementType } from '../../table/IRSCTable';

type SelectorWithPillsProps = {
  data: ComplianceRequirementsType | undefined
}

// @TODO - Fix typescript errors
const SelectBBs = ({ data }: SelectorWithPillsProps) => {
  const { formatMessage } = useIntl();
  const format = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [updatedRows, setUpdatedRows] = useState([]);
  const [options, setOptions] = useState([]);

  const handleSetOptions = () => setOptions(data?.map((item) => ({ value: item, label: item.bbName })));

  useEffect(() => {
    handleSetOptions();
  }, [data]);

  useEffect(() => {
    // @TODO - pass to 'updatedRows' and update updated rows from IRSCTable 'data' variable to main object 'selectedItems'
    updatedRows?.map((row) => {
      selectedItems?.value?.requirements.crossCutting.map((item: RequirementType) => item._id === row._id ? row : item);
    });

    console.log(selectedItems);

  }, [updatedRows]);

  const handleOnSelect = (value: { value: ComplianceRequirementsType, label: string }) => {
    setOptions([...options.filter(({ label }) => label !== value.label)]);
    setSelectedItems([...selectedItems, value]);
  };

  const handleOnRemovePill = (item: { value: ComplianceRequirementsType, label: string }) => {
    setSelectedItems([...selectedItems.filter(({ label }) => label !== item.label)]);
    setOptions([...options, item]);
  };

  useEffect(() => {
    options?.sort((prevItem: { label: string }, nextItem: { label: string }) =>
      prevItem.label.localeCompare(nextItem.label));
  }, [options]);

  const handleClearAllSelectedItems = () => setSelectedItems([]);

  const displayPills = selectedItems.map((item: InputSingleOptionProps) => {
    return (
      <Pill key={`key-${item.label}`} label={item.label} onRemove={() => handleOnRemovePill(item)}/>
    );
  });

  const displayTable = selectedItems.map((item: InputSingleOptionProps) => {

    return (
      <div className='table-container' key={item.value.bbKey}>
        <p style={{ fontWeight: 'bold', margin: '24px 0' }}>{item.label} BB</p>
        <Input
          inputKey={`input-${item.value.bbKey}`}
          tipMessage={format('form.test_harness.tip_message.label')}
          isInvalid={false}
          required
          name={'test'}
          inputTitle={format('form.test_harness.title.label')}
          className='input-width-400'
        />
        <p style={{ margin: '32px 0 16px' }}>{format('form.table.title.label')}</p>
        <IRSCTable
          selectedData={item.value.requirements.crossCutting}
        />
      </div>
    );
  });

  return (
    <div className='main-block'>
      <SelectInput
        placeholder='Select Building Block(s)'
        className='input-select'
        onChange={handleOnSelect}
        options={options}
        handleSetOptions={handleSetOptions}
      />
      {selectedItems.length > 0 &&
        <div>
          <div className='pills-container'>
            <div
              className='pills-clear-all'
              onClick={handleClearAllSelectedItems}>{
                format('form.clear_selection.label')}
            </div>
            {displayPills}
          </div>
          {displayTable}
        </div>
      }
    </div>
  );
};

export default SelectBBs;
