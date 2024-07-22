import { RefObject, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Pill from '../Pill';
import SelectInput from '../inputs/SelectInput';
import { ComplianceRequirementsType, SoftwareDetailsDataType, } from '../../../service/types';
import useTranslations from '../../../hooks/useTranslation';
import useGetDraftData from '../../../hooks/useGetDraftDetail';
import { REQUIREMENT_SPEC_STORAGE_NAME } from '../../../service/constants';
import IRSCFunctionalTable from '../../table/IRSC/IRSCFunctionalTable';
import IRSCCrossCuttingTableType from '../../table/IRSC/IRSCCrossCuttingTable';
import IRSCKeyDigitalFunctionalitiesTableType from '../../table/IRSC/IRSCKeyDigitalFunctionalitiesTable';

export type IRSCRequirementsFormRef = {
  validate: () => boolean;
};

type SelectorWithPillsProps = {
  interfaceRequirementsData: ComplianceRequirementsType[] | undefined;
  setUpdatedBBs?: (data: ComplianceRequirementsType[]) => void;
  IRSCRequirementsFormRef?: RefObject<IRSCRequirementsFormRef>;
  readOnlyView?: boolean;
  readOnlyData?: SoftwareDetailsDataType;
  isFormActive?: boolean;
};

const RequirementSpecificationSelectBBs = ({
  interfaceRequirementsData,
  setUpdatedBBs,
  IRSCRequirementsFormRef,
  readOnlyView = false,
  readOnlyData,
  isFormActive = false,
}: SelectorWithPillsProps) => {
  const [selectedItems, setSelectedItems] = useState<
    ComplianceRequirementsType[]
  >([]);
  const [updatedCrossCuttingData, setUpdatedCrossCuttingData] =
    useState<ComplianceRequirementsType>();
  const [updatedFunctionalData, setUpdatedFunctionalData] =
    useState<ComplianceRequirementsType>();
  const [updatedKDFData, setUpdatedKDFData] =
    useState<ComplianceRequirementsType>();
  const [options, setOptions] = useState<
    { value: ComplianceRequirementsType | undefined; label: string }[]
  >([{ value: undefined, label: '' }]);
  const [isCrossCuttingTableValid, setIsCrossCuttingTableTableValid] =
    useState(true);
  const [isFunctionalTableValid, setIsFunctionalTableValid] = useState(true);
  const [isKDFTableValid, setIsKDFTableValid] = useState(true);
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

  const selectRef = useRef<HTMLDivElement>(null);
  const [isSelectFocused, setIsSelectFocused] = useState(false);

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
    if (updatedKDFData) {
      const updatedSecondArrFromObjectThree = selectedItems.map((item) => {
        if (item.bbKey === updatedKDFData.bbKey) {
          return {
            ...item,
            requirements: {
              ...item.requirements,
              keyDigitalFunctionalities: updatedKDFData.requirements.keyDigitalFunctionalities,
            },
          };
        }

        return item;
      });

      setSelectedItems(updatedSecondArrFromObjectThree);
    }
  }, [updatedKDFData]);

  useEffect(() => {
    if (setUpdatedBBs) {
      if (!readOnlyView) {
        localStorage.removeItem(REQUIREMENT_SPEC_STORAGE_NAME);
        localStorage.setItem(
          REQUIREMENT_SPEC_STORAGE_NAME,
          JSON.stringify(selectedItems)
        );
      }

      setUpdatedBBs(selectedItems);
    }
  }, [selectedItems]);

  useEffect(() => {
    options?.sort((prevItem: { label: string }, nextItem: { label: string }) =>
      prevItem.label.localeCompare(nextItem.label)
    );
  }, [options]);

  const handleAlreadySavedData = () => {
    if (savedInLocalStorage?.length && !readOnlyView) {
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

    if (draftData || readOnlyData) {
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
                (formDetail.bbDetails[bbKey].requirementSpecificationCompliance
                  .crossCuttingRequirements.length ||
                formDetail.bbDetails[bbKey].requirementSpecificationCompliance
                  .functionalRequirements.length ||
                formDetail.bbDetails[bbKey].requirementSpecificationCompliance
                  .keyDigitalFunctionalitiesRequirements.length)
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
                    keyDigitalFunctionalities:
                      formDetail.bbDetails[bbKey]
                        .requirementSpecificationCompliance
                        .keyDigitalFunctionalitiesRequirements
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
        if (!readOnlyView) {
          localStorage.removeItem(REQUIREMENT_SPEC_STORAGE_NAME);
          localStorage.setItem(
            REQUIREMENT_SPEC_STORAGE_NAME,
            JSON.stringify(combinedArray)
          );
        }

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
    setIsSelectFocused(false);
  };

  const handleOnRemovePill = (item: {
    value: ComplianceRequirementsType;
    label: string;
  }) => {
    setSelectedItems([
      ...selectedItems.filter(({ bbName }) => bbName !== item.label),
    ]);
    setOptions([...options, item]);
    if (!readOnlyView) {
      localStorage.removeItem(REQUIREMENT_SPEC_STORAGE_NAME);
      localStorage.setItem(
        REQUIREMENT_SPEC_STORAGE_NAME,
        JSON.stringify([
          ...selectedItems.filter(({ bbName }) => bbName !== item.label),
        ])
      );
    }
  };

  const handleClearAllSelectedItems = () => {
    setSelectedItems([]);
    if (interfaceRequirementsData) {
      const options = interfaceRequirementsData.map((item) => ({
        value: item,
        label: item.bbName,
      }));
      setOptions(options);
    }

    localStorage.removeItem(REQUIREMENT_SPEC_STORAGE_NAME);
  };

  const isFulfillmentValid = (data: ComplianceRequirementsType[]) => {
    return data.every((item) => {
      let isValidCrossCutting = true;
      let isValidFunctional = true;
      let isValidKDF = true;

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

      if (
        item.requirements.keyDigitalFunctionalities &&
          item.requirements.keyDigitalFunctionalities.length > 0
      ) {
        isValidKDF = item.requirements.keyDigitalFunctionalities.every(
          (KDFItem) => {
            if (KDFItem.status === 0) {
              return (
                KDFItem.fulfillment != null &&
                    KDFItem.fulfillment !== -1
              );
            }

            return true;
          }
        );
      }

      setIsCrossCuttingTableTableValid(isValidCrossCutting);
      setIsFunctionalTableValid(isValidFunctional);
      setIsKDFTableValid(isValidKDF);

      return isValidCrossCutting && isValidFunctional && isValidKDF;
    });
  };

  useImperativeHandle(
    IRSCRequirementsFormRef,
    () => ({
      validate: () => {
        return isFulfillmentValid(selectedItems);
      },
    }),
    [selectedItems]
  );

  const handleFocus = () => {
    setIsSelectFocused(true);
    setTimeout(() => {
      if (selectedItems.length === 0) {
        selectRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

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
        {item.requirements?.keyDigitalFunctionalities?.length ? (
          <>
            <p className="table-container-name">{item.bbName} BB</p>
            <p className="table-container-title">
              {format('form.kdf_requirements.label')}
            </p>
            <IRSCKeyDigitalFunctionalitiesTableType
              selectedData={item}
              setUpdatedData={setUpdatedKDFData}
              isTableValid={isKDFTableValid}
              readOnlyView={readOnlyView}
              isFormActive={isFormActive}
            />
          </>
        ) : null}
        {item.requirements?.crossCutting.length ? (
          <>
            <p className="table-container-title">
              {format('form.cross_cutting_requirements.label')}
            </p>
            <IRSCCrossCuttingTableType
              selectedData={item}
              setUpdatedData={setUpdatedCrossCuttingData}
              isTableValid={isCrossCuttingTableValid}
              readOnlyView={readOnlyView}
              isFormActive={isFormActive}
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
              isFormActive={isFormActive}
            />
          </>
        ) : null}
      </div>
    );
  });

  return (
    <div className="main-block">
      {!readOnlyView && (
        <div ref={selectRef}>
          <SelectInput
            placeholder="Select Building Block(s)"
            className="input-select"
            onChange={handleOnSelect}
            // @ts-ignore
            options={options}
            handleSetOptions={handleSetOptions}
            onFocus={handleFocus}
            onBlur={() => setIsSelectFocused(false)}
          />
        </div>
      )}
      {selectedItems.length > 0 ? (
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
      ) : (
        <div className={classNames({ 'height-150': (isSelectFocused && selectedItems.length === 0) })}>
          {format('app.view_report_details.noInformation',
            { section: `${format('table.requirement_specification_compliance.label')}` })}
        </div>
      )}
    </div>
  );
};

export default RequirementSpecificationSelectBBs;
