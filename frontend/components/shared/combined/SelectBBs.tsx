import { RefObject, useEffect, useImperativeHandle, useState } from 'react';
import Pill from '../Pill';
import SelectInput from '../inputs/SelectInput';
import {
  ComplianceRequirementsType,
  InputSingleOptionProps,
} from '../../../service/types';
import Input from '../inputs/Input';
import IRSCTable from '../../table/IRSCTable';
import useTranslations from '../../../hooks/useTranslation';

export type IRSCFormRef = {
  validate: () => boolean;
};

type SelectorWithPillsProps = {
  data: ComplianceRequirementsType[] | undefined;
  setUpdatedBBs: (data: ComplianceRequirementsType[]) => void;
  IRSCFormRef: RefObject<IRSCFormRef>;
};

const SelectBBs = ({
  data,
  setUpdatedBBs,
  IRSCFormRef,
}: SelectorWithPillsProps) => {
  const [selectedItems, setSelectedItems] = useState<
    ComplianceRequirementsType[]
  >([]);
  const [updatedSelectedItems, setUpdatedSelectedItems] = useState<
    ComplianceRequirementsType[]
  >([]);
  const [updatedData, setUpdatedData] = useState<ComplianceRequirementsType>();
  const [options, setOptions] = useState<
    { value: ComplianceRequirementsType | undefined; label: string }[]
  >([{ value: undefined, label: '' }]);
  const [isTableValid, setIsTableValid] = useState(true);
  const [isTestHarnessInputValid, setIsTestHarnessInputValid] =
    useState<boolean>(true);

  const { format } = useTranslations();

  const handleSetOptions = () => {
    if (data) {
      const options = data?.map((item) => ({
        value: item,
        label: item.bbName,
      }));
      setOptions(options);
    }
  };

  useEffect(() => {
    handleSetOptions();
  }, [data]);

  useEffect(() => {
    setUpdatedBBs(
      selectedItems?.map((item) =>
        item?.bbKey === updatedData?.bbKey ? updatedData : item
      )
    );
    setUpdatedSelectedItems(
      selectedItems?.map((item) =>
        item?.bbKey === updatedData?.bbKey ? updatedData : item
      )
    );
  }, [updatedData, selectedItems]);

  useEffect(() => {
    options?.sort((prevItem: { label: string }, nextItem: { label: string }) =>
      prevItem.label.localeCompare(nextItem.label)
    );
  }, [options]);

  const handleOnSelect = (value: {
    value: ComplianceRequirementsType;
    label: string;
  }) => {
    setOptions([...options.filter(({ label }) => label !== value.label)]);
    setSelectedItems([...selectedItems, value.value]);
  };

  const handleOnRemovePill = (item: {
    value: ComplianceRequirementsType;
    label: string;
  }) => {
    setSelectedItems([
      ...selectedItems.filter(({ bbName }) => bbName !== item.label),
    ]);
    setOptions([...options, item]);
  };

  const handleTestHarnessLink = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, name } = event.target;
    setIsTestHarnessInputValid(true);

    const foundIndex = selectedItems.findIndex((item) => item.bbKey === name);
    if (foundIndex !== -1) {
      selectedItems[foundIndex].interfaceCompliance =
        selectedItems[foundIndex].interfaceCompliance || {};

      selectedItems[foundIndex].interfaceCompliance.testHarnessResult = value;
      selectedItems[foundIndex].interfaceCompliance.requirements = [];

      setSelectedItems(selectedItems);
    }
  };

  const handleClearAllSelectedItems = () => setSelectedItems([]);

  const isFulfillmentValid = (data: ComplianceRequirementsType[]) => {
    console.log('data validacja', data);

    const isTableValid = data.every((dataItem) =>
      dataItem.requirements.crossCutting.every(
        (item) => item.fulfillment !== undefined && item.fulfillment !== null
      )
    );
    const isTestHarnessInputValid = data.every(
      (dataItem) =>
        dataItem.interfaceCompliance &&
        dataItem.interfaceCompliance.testHarnessResult !== null &&
        dataItem.interfaceCompliance.testHarnessResult !== undefined &&
        dataItem.interfaceCompliance.testHarnessResult !== ''
    );
    console.log('isTestHarnessInputValid', isTestHarnessInputValid);
    console.log('isTableValid', isTableValid);

    setIsTestHarnessInputValid(isTestHarnessInputValid);

    const isValid = isTableValid && isTestHarnessInputValid;

    return isValid;
  };

  console.log('selectedItems', selectedItems);

  useImperativeHandle(
    IRSCFormRef,
    () => ({
      validate: () => {
        const isValid = isFulfillmentValid(updatedSelectedItems);
        setIsTableValid(isValid);

        return isValid;
      },
    }),
    [updatedSelectedItems]
  );

  const displayPills = selectedItems.map((item) => {
    return (
      <Pill
        key={`key-${item.bbKey}`}
        label={item.bbName}
        onRemove={() => handleOnRemovePill({ value: item, label: item.bbName })}
      />
    );
  });

  const displayTable = selectedItems.map((item) => {
    return (
      <div key={item.bbKey}>
        <p className="table-container-name">{item.bbName} BB</p>
        <Input
          inputKey={`input-${item.bbKey}`}
          tipMessage={format('form.test_harness.tip_message.label')}
          isInvalid={!isTestHarnessInputValid}
          required
          name={item.bbKey}
          inputTitle={format('form.test_harness.title.label')}
          className="input-width-400"
          onChange={(event) => handleTestHarnessLink(event)}
          errorMessage={format('form.required_field.message')}
        />
        <p className="table-container-title">
          {format('form.table.title.label')}
        </p>
        <IRSCTable
          selectedData={item}
          setUpdatedData={setUpdatedData}
          isTableValid={isTableValid}
        />
      </div>
    );
  });

  return (
    <div className="main-block">
      <SelectInput
        placeholder="Select Building Block(s)"
        className="input-select"
        onChange={handleOnSelect}
        // @ts-ignore
        options={options}
        handleSetOptions={handleSetOptions}
      />
      {selectedItems.length > 0 && (
        <div>
          <div className="pills-container">
            <div
              className="pills-clear-all"
              onClick={handleClearAllSelectedItems}
            >
              {format('form.clear_selection.label')}
            </div>
            {displayPills}
          </div>
          {displayTable}
        </div>
      )}
    </div>
  );
};

export default SelectBBs;
