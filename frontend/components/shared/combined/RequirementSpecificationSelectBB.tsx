import { RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { useRouter } from 'next/router';
import Pill from '../Pill';
import SelectInput from '../inputs/SelectInput';
import {
  ComplianceRequirementsType,
  SoftwareDetailsDataType,
} from '../../../service/types';
import useTranslations from '../../../hooks/useTranslation';
import useGetDraftData from '../../../hooks/useGetDraftDetail';
import { REQUIREMENT_SPEC_STORAGE_NAME } from '../../../service/constants';
import IRSCFunctionalTable from '../../table/IRSC/IRSCFunctionalTable';
import IRSCCrossCuttingTableType from '../../table/IRSC/IRSCCrossCuttingTable';

export type IRSCRequirementsFormRef = {
  validate: () => boolean;
};

type SelectorWithPillsProps = {
  interfaceRequirementsData: ComplianceRequirementsType[] | undefined;
  setUpdatedBBs?: (data: ComplianceRequirementsType[]) => void;
  IRSCRequirementsFormRef?: RefObject<IRSCRequirementsFormRef>;
  readOnlyView?: boolean;
  readOnlyData?: SoftwareDetailsDataType;
};

const RequirementSpecificationSelectBBs = ({
  interfaceRequirementsData,
  setUpdatedBBs,
  IRSCRequirementsFormRef,
  readOnlyView = false,
  readOnlyData,
}: SelectorWithPillsProps) => {
  const [selectedItems, setSelectedItems] = useState<
    ComplianceRequirementsType[]
  >([]);
  const [updatedCrossCuttingData, setUpdatedCrossCuttingData] =
    useState<ComplianceRequirementsType>();
  const [updatedFunctionalData, setUpdatedFunctionalData] =
    useState<ComplianceRequirementsType>();
  const [options, setOptions] = useState<
    { value: ComplianceRequirementsType | undefined; label: string }[]
  >([{ value: undefined, label: '' }]);
  const [isCrossCuttingTableValid, setIsCrossCuttingTableTableValid] =
    useState(true);
  const [isFunctionalTableValid, setIsFunctionalTableValid] = useState(true);
  const [savedInLocalStorage, setSavedInLocalStorage] = useState<
    ComplianceRequirementsType[] | null
  >(
    JSON.parse(
      localStorage.getItem(REQUIREMENT_SPEC_STORAGE_NAME as string) || 'null'
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
    if (updatedCrossCuttingData) {
      const updatedSecondArrFromObjectOne = selectedItems.map((item) => {
        if (item.bbKey === updatedCrossCuttingData.bbKey) {
          return {
            ...item,
            requirements: {
              ...item.requirements,
              crossCutting: updatedCrossCuttingData.requirements.crossCutting,
            },
          };
        }

        return item;
      });
      setSelectedItems(updatedSecondArrFromObjectOne);
    }
  }, [updatedCrossCuttingData]);

  useEffect(() => {
    if (updatedFunctionalData && !readOnlyView) {
      const updatedSecondArrFromObjectTwo = selectedItems.map((item) => {
        if (item.bbKey === updatedFunctionalData.bbKey) {
          return {
            ...item,
            requirements: {
              ...item.requirements,
              functional: updatedFunctionalData.requirements.functional,
            },
          };
        }

        return item;
      });

      setSelectedItems(updatedSecondArrFromObjectTwo);
    }
  }, [updatedFunctionalData, readOnlyView]);

  useEffect(() => {
    if (setUpdatedBBs) {
      localStorage.removeItem(REQUIREMENT_SPEC_STORAGE_NAME);
      localStorage.setItem(
        REQUIREMENT_SPEC_STORAGE_NAME,
        JSON.stringify(selectedItems)
      );
      setUpdatedBBs(selectedItems);
    }
  }, [selectedItems]);

  useEffect(() => {
    options?.sort((prevItem: { label: string }, nextItem: { label: string }) =>
      prevItem.label.localeCompare(nextItem.label)
    );
  }, [options]);

  const handleAlreadySavedData = () => {
    if (savedInLocalStorage?.length) {
      const BBWithAddedCrossCuttings = savedInLocalStorage.map((itemBB) => {
        if (itemBB.requirements.crossCutting.length) {
          return itemBB;
        }

        if (!itemBB.requirements.crossCutting.length) {
          return;
        }
      });
      const filteredBBWithAddedCrossCuttings = BBWithAddedCrossCuttings?.filter(
        (bb) => bb !== undefined
      );
      if (!filteredBBWithAddedCrossCuttings.length) {
        return;
      }

      if (filteredBBWithAddedCrossCuttings.length > 0) {
        setSelectedItems(
          filteredBBWithAddedCrossCuttings as ComplianceRequirementsType[]
        );

        return;
      }

      return;
    }

    if ((draftData || readOnlyData) && !savedInLocalStorage?.length) {
      const data = draftData ?? readOnlyData;
      const combinedArray = data?.formDetails
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
                formDetail.bbDetails[bbKey].requirementSpecificationCompliance
                  .crossCuttingRequirements.length
              ) {
                combinedItem = {
                  bbName: matchingFirstArrItem.bbName,
                  bbKey: matchingFirstArrItem.bbKey,
                  bbVersion: matchingFirstArrItem.bbVersion,
                  dateOfSave: matchingFirstArrItem.dateOfSave,
                  requirements: {
                    crossCutting:
                      formDetail.bbDetails[bbKey]
                        .requirementSpecificationCompliance
                        .crossCuttingRequirements,
                    functional:
                      formDetail.bbDetails[bbKey]
                        .requirementSpecificationCompliance
                        .functionalRequirements,
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

      if (combinedArray && combinedArray.length > 0) {
        setSelectedItems(combinedArray as ComplianceRequirementsType[] | []);
        localStorage.removeItem(REQUIREMENT_SPEC_STORAGE_NAME);
        localStorage.setItem(
          REQUIREMENT_SPEC_STORAGE_NAME,
          JSON.stringify(combinedArray)
        );

        return;
      }
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
          value: item,
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
    localStorage.removeItem(REQUIREMENT_SPEC_STORAGE_NAME);
    localStorage.setItem(
      REQUIREMENT_SPEC_STORAGE_NAME,
      JSON.stringify([
        ...selectedItems.filter(({ bbName }) => bbName !== item.label),
      ])
    );
  };

  const handleClearAllSelectedItems = () => {
    setSelectedItems([]);
    localStorage.removeItem(REQUIREMENT_SPEC_STORAGE_NAME);
  };

  const isFulfillmentValid = (data: ComplianceRequirementsType[]) => {
    const isTableValid = data.every((item) => {
      let isValidCrossCutting = true;
      let isValidFunctional = true;

      if (
        item.requirements.crossCutting &&
        item.requirements.crossCutting.length > 0
      ) {
        isValidCrossCutting = item.requirements.crossCutting.every(
          (crossCuttingItem) => {
            if (crossCuttingItem.status === 0) {
              return (
                crossCuttingItem.fulfillment != null &&
                crossCuttingItem.fulfillment !== -1
              );
            }

            return true;
          }
        );
      }

      if (
        item.requirements.functional &&
        item.requirements.functional.length > 0
      ) {
        isValidFunctional = item.requirements.functional.every(
          (functionalItem) => {
            if (functionalItem.status === 0) {
              return (
                functionalItem.fulfillment != null &&
                functionalItem.fulfillment !== -1
              );
            }

            return true;
          }
        );
      }

      setIsCrossCuttingTableTableValid(isValidCrossCutting);
      setIsFunctionalTableValid(isValidFunctional);

      return isValidCrossCutting && isValidFunctional;
    });

    return isTableValid;
  };

  useImperativeHandle(
    IRSCRequirementsFormRef,
    () => ({
      validate: () => {
        const isValid = isFulfillmentValid(selectedItems);

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
        readOnly={readOnlyView}
      />
    );
  });

  const displayTable = selectedItems.map((item) => {
    return (
      <div key={item.bbKey}>
        {item.requirements?.functional.length ? (
          <>
            <p className="table-container-name">{item.bbName} BB</p>
            <p className="table-container-title">
              {format('form.cross_cutting_requirements.label')}
            </p>
            <IRSCCrossCuttingTableType
              selectedData={item}
              setUpdatedData={setUpdatedCrossCuttingData}
              isTableValid={isCrossCuttingTableValid}
              readOnlyView={readOnlyView}
            />
          </>
        ) : null}
        {item.requirements?.functional.length ? (
          <>
            <p className="table-container-title">
              {format('form.functional_requirements.label')}
            </p>
            <IRSCFunctionalTable
              selectedData={item}
              setUpdatedData={setUpdatedFunctionalData}
              isTableValid={isFunctionalTableValid}
              readOnlyView={readOnlyView}
            />
          </>
        ) : null}
      </div>
    );
  });

  return (
    <div className="main-block">
      {!readOnlyView && (
        <SelectInput
          placeholder="Select Building Block(s)"
          className="input-select"
          onChange={handleOnSelect}
          // @ts-ignore
          options={options}
          handleSetOptions={handleSetOptions}
        />
      )}
      {selectedItems.length > 0 && (
        <div>
          <div className="pills-container">
            {readOnlyView ? (
              <div className="pills-explanation">
                {format('details_view.bbs_used.label')}
              </div>
            ) : (
              <div
                className="pills-clear-all"
                onClick={handleClearAllSelectedItems}
              >
                {format('form.clear_selection.label')}
              </div>
            )}

            {displayPills}
          </div>
          {displayTable}
        </div>
      )}
    </div>
  );
};

export default RequirementSpecificationSelectBBs;
