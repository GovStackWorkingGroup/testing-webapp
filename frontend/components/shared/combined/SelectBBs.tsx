import { RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { useRouter } from 'next/router';
import Pill from '../Pill';
import SelectInput from '../inputs/SelectInput';
import { ComplianceRequirementsType } from '../../../service/types';
import Input from '../inputs/Input';
import IRSCInterfaceTable from '../../table/IRSC/IRSCInterfaceTable';
import useTranslations from '../../../hooks/useTranslation';
import useGetDraftData from '../../../hooks/useGetDraftDetail';
import { INTERFACE_COMPLIANCE_STORAGE_NAME } from '../../../service/constants';

export type IRSCFormRef = {
  validate: () => boolean;
};

type SelectorWithPillsProps = {
  interfaceRequirementsData: ComplianceRequirementsType[] | undefined;
  setUpdatedBBs: (data: ComplianceRequirementsType[]) => void;
  IRSCFormRef: RefObject<IRSCFormRef>;
};

const SelectBBs = ({
  interfaceRequirementsData,
  setUpdatedBBs,
  IRSCFormRef,
}: SelectorWithPillsProps) => {
  const [selectedItems, setSelectedItems] = useState<
    ComplianceRequirementsType[]
  >([]);
  const [updatedData, setUpdatedData] = useState<ComplianceRequirementsType>();
  const [options, setOptions] = useState<
    { value: ComplianceRequirementsType | undefined; label: string }[]
  >([{ value: undefined, label: '' }]);
  const [isTableValid, setIsTableValid] = useState(true);
  const [isTestHarnessInputValid, setIsTestHarnessInputValid] =
    useState<boolean>(true);
  const [savedInLocalStorage, setSavedInLocalStorage] = useState<
    ComplianceRequirementsType[] | null
  >(
    JSON.parse(
      localStorage.getItem(INTERFACE_COMPLIANCE_STORAGE_NAME as string) ||
        'null'
    )
  );
  const router = useRouter();
  const { format } = useTranslations();

  const { draftUUID } = router.query;
  const { draftData } = useGetDraftData({
    draftUUID: (draftUUID as string) || undefined,
  });

  useEffect(() => {
    handleAlreadySavedData();
  }, [draftData, savedInLocalStorage, interfaceRequirementsData]);

  useEffect(() => {
    handleSetOptions();
  }, [interfaceRequirementsData]);

  useEffect(() => {
    const updatedSelectedItemsData = selectedItems?.map((item) =>
      item?.bbKey === updatedData?.bbKey ? updatedData : item
    );
    setSelectedItems(updatedSelectedItemsData);

    localStorage.removeItem(INTERFACE_COMPLIANCE_STORAGE_NAME);
    localStorage.setItem(
      INTERFACE_COMPLIANCE_STORAGE_NAME,
      JSON.stringify(updatedSelectedItemsData)
    );

    setUpdatedBBs(updatedSelectedItemsData);
  }, [updatedData]);

  useEffect(() => {
    options?.sort((prevItem: { label: string }, nextItem: { label: string }) =>
      prevItem.label.localeCompare(nextItem.label)
    );
  }, [options]);

  const handleAlreadySavedData = () => {
    if (savedInLocalStorage?.length) {
      const BBWithAddedInterface = savedInLocalStorage.map((itemBB) => {
        if (itemBB.requirements.interface.length) {
          return itemBB;
        }

        if (!itemBB.requirements.interface.length) {
          return;
        }
      });
      const filteredBBWithAddedInterface = BBWithAddedInterface?.filter(
        (bb) => bb !== undefined
      );
      if (!filteredBBWithAddedInterface.length) {
        return;
      }

      if (filteredBBWithAddedInterface.length > 0) {
        setSelectedItems(
          filteredBBWithAddedInterface as ComplianceRequirementsType[]
        );

        return;
      }

      return;
    }

    if (draftData?.formDetails[0].bbDetails) {
      const combinedArray = draftData?.formDetails
        .map((formDetail) => {
          if (formDetail.bbDetails) {
            const bbKeys = Object.keys(formDetail.bbDetails);

            const combinedItems = bbKeys.map((bbKey) => {
              const matchingFirstArrItem = interfaceRequirementsData?.find(
                (item) => item.bbKey === bbKey
              );

              let combinedItem;

              if (
                matchingFirstArrItem &&
                formDetail.bbDetails[bbKey].interfaceCompliance.requirements
                  .length > 0
              ) {
                combinedItem = {
                  bbName: matchingFirstArrItem.bbName,
                  bbKey: matchingFirstArrItem.bbKey,
                  bbVersion: matchingFirstArrItem.bbVersion,
                  dateOfSave: matchingFirstArrItem.dateOfSave,
                  requirements: {
                    crossCutting: [],
                    functional: [],
                    interface:
                      formDetail.bbDetails[bbKey].interfaceCompliance
                        .requirements,
                  },
                  interfaceCompliance: {
                    testHarnessResult:
                      formDetail.bbDetails[bbKey].interfaceCompliance
                        ?.testHarnessResult || '',
                    requirements:
                      formDetail.bbDetails[bbKey].interfaceCompliance
                        ?.requirements || [],
                  },
                };
              } else {
                combinedItem = null;
              }

              return combinedItem;
            });

            return combinedItems.filter(Boolean); // Remove null values from the combined items
          } else {
            return [];
          }
        })
        .flat();

      if (combinedArray.length > 0) {
        setSelectedItems(combinedArray as ComplianceRequirementsType[]);
        localStorage.removeItem(INTERFACE_COMPLIANCE_STORAGE_NAME);
        localStorage.setItem(
          INTERFACE_COMPLIANCE_STORAGE_NAME,
          JSON.stringify(combinedArray)
        );
      }

      return;
    }
  };

  const handleSetOptions = () => {
    if (interfaceRequirementsData) {
      if (selectedItems) {
        const filteredInterfaceRequirementsData =
          interfaceRequirementsData.filter(
            (item) =>
              !selectedItems.some(
                (combinedItem) => combinedItem.bbKey === item.bbKey
              )
          );
        const options = filteredInterfaceRequirementsData?.map((item) => ({
          value: {
            ...item,
            interfaceCompliance: {
              testHarnessResult: '',
              requirements: item.requirements.interface,
            },
          },
          label: item.bbName,
        }));
        setOptions(options);

        return;
      }

      const options = interfaceRequirementsData?.map((item) => ({
        value: item,
        label: item.bbName,
      }));
      setOptions(options);
    }
  };

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
    localStorage.removeItem(INTERFACE_COMPLIANCE_STORAGE_NAME);
    localStorage.setItem(
      INTERFACE_COMPLIANCE_STORAGE_NAME,
      JSON.stringify([
        ...selectedItems.filter(({ bbName }) => bbName !== item.label),
      ])
    );
  };

  const handleTestHarnessLink = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, name } = event.target;

    setIsTestHarnessInputValid(true);

    const foundIndex = selectedItems.findIndex((item) => item.bbKey === name);
    const newSelectedItems = [...selectedItems];
    if (foundIndex !== -1) {
      newSelectedItems[foundIndex].interfaceCompliance =
        newSelectedItems[foundIndex].interfaceCompliance || {};

      newSelectedItems[foundIndex].interfaceCompliance.testHarnessResult =
        value;

      setUpdatedData({ ...newSelectedItems[foundIndex] });
      localStorage.removeItem(INTERFACE_COMPLIANCE_STORAGE_NAME);
      localStorage.setItem(
        INTERFACE_COMPLIANCE_STORAGE_NAME,
        JSON.stringify(newSelectedItems)
      );

      return;
    }

    if (foundIndex > 0) {
      newSelectedItems[foundIndex].interfaceCompliance.testHarnessResult =
        value;

      setUpdatedData({ ...newSelectedItems[foundIndex] });
      localStorage.removeItem(INTERFACE_COMPLIANCE_STORAGE_NAME);
      localStorage.setItem(
        INTERFACE_COMPLIANCE_STORAGE_NAME,
        JSON.stringify(newSelectedItems)
      );

      return;
    }
  };

  const handleClearAllSelectedItems = () => {
    setSelectedItems([]);
    localStorage.removeItem(INTERFACE_COMPLIANCE_STORAGE_NAME);
  };

  const isFulfillmentValid = (data: ComplianceRequirementsType[]) => {
    const isTableValid = data.every((dataItem) =>
      dataItem.requirements.interface.every(
        (item) =>
          item.fulfillment !== undefined ||
          item.fulfillment !== null ||
          item.fulfillment !== -1
      )
    );
    const isTestHarnessInputValid = data.every(
      (dataItem) =>
        dataItem.interfaceCompliance &&
        dataItem.interfaceCompliance.testHarnessResult !== null &&
        dataItem.interfaceCompliance.testHarnessResult !== undefined &&
        dataItem.interfaceCompliance.testHarnessResult !== ''
    );

    setIsTestHarnessInputValid(isTestHarnessInputValid);

    const isValid = isTableValid && isTestHarnessInputValid;

    return isValid;
  };

  useImperativeHandle(
    IRSCFormRef,
    () => ({
      validate: () => {
        const isValid = isFulfillmentValid(selectedItems);
        setIsTableValid(isValid);

        return isValid;
      },
    }),
    [selectedItems]
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
          isInvalid={
            !isTestHarnessInputValid &&
            !item.interfaceCompliance.testHarnessResult
          }
          required
          name={item.bbKey}
          inputTitle={format('form.test_harness.title.label')}
          className="input-width-400"
          onChange={(event) => handleTestHarnessLink(event)}
          errorMessage={format('form.required_field.message')}
          defaultValue={
            item?.interfaceCompliance
              ? item.interfaceCompliance.testHarnessResult
              : ''
          }
        />
        <p className="table-container-title">
          {format('form.table.title.label')}
        </p>
        <IRSCInterfaceTable
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
