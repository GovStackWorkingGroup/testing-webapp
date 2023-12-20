import { RefObject, useEffect, useState } from 'react';
import classNames from 'classnames';
import { ComplianceRequirementsType } from '../../service/types';
import useTranslations from '../../hooks/useTranslation';
import { IRSCFormRef } from '../shared/combined/SelectBBs';
import InterfaceCompliance from './InterfaceCompliance';
import RequirementSpecificationComplianceForm from './RequirementSpecificationForm';

type activeTabProps = 'interface' | 'specification';

type IRSFormProps = {
  setUpdatedBBs: (data: ComplianceRequirementsType[] | undefined) => void;
  IRSCInterfaceFormRef: RefObject<IRSCFormRef>;
  IRSCRequirementsFormRef: RefObject<IRSCFormRef>;
  onEdited: (hasError: boolean) => void;
};

const IRSForm = ({
  setUpdatedBBs,
  IRSCInterfaceFormRef,
  IRSCRequirementsFormRef,
  onEdited,
}: IRSFormProps) => {
  const [activeTab, setActiveTab] = useState<activeTabProps>('interface');
  const [updatedInterfaceData, setUpdatedInterfaceData] = useState<
    ComplianceRequirementsType[] | undefined
  >();
  const [updatedRequirementSpecData, setUpdatedRequirementSpecData] = useState<
    ComplianceRequirementsType[] | undefined
  >([]);
  const [allData, setAllData] = useState<
    ComplianceRequirementsType[] | undefined
  >();

  const { format } = useTranslations();

  useEffect(() => {
    if (!allData?.length && updatedInterfaceData) {
      const updatedData = updatedInterfaceData.map((data) => {
        return {
          ...data,
          requirements: { crossCutting: [], functional: [], interface: [] },
        };
      });
      setAllData(updatedData);

      return;
    }

    if (!allData?.length && updatedRequirementSpecData) {
      setAllData(updatedRequirementSpecData);

      return;
    }

    if (
      allData?.length &&
      (updatedInterfaceData || updatedRequirementSpecData)
    ) {
      const updatedData = allData.map((item) => {
        const matchingUpdatedRequirementSpecData =
          updatedRequirementSpecData?.find(
            (nextItem) => nextItem.bbKey === item.bbKey
          );
        const matchingUpdatedInterfaceData = updatedInterfaceData?.find(
          (nextItem) => nextItem.bbKey === item.bbKey
        );

        if (
          matchingUpdatedInterfaceData ||
          matchingUpdatedRequirementSpecData
        ) {
          return {
            ...item,
            interfaceCompliance: {
              ...item.interfaceCompliance,
              testHarnessResult:
                matchingUpdatedInterfaceData?.interfaceCompliance
                  ?.testHarnessResult || '',
              requirements:
                matchingUpdatedInterfaceData?.requirements.interface,
            },
            requirements: matchingUpdatedRequirementSpecData?.requirements || {
              crossCutting: [],
              functional: [],
              interface: [],
            },
          };
        }
      });

      const nonMatchingInterfaceItems = updatedInterfaceData?.filter(
        (newItem) => !allData.find((item) => item.bbKey === newItem.bbKey)
      );
      const nonMatchingRequirementItems = updatedRequirementSpecData?.filter(
        (newItem) => !allData.find((item) => item.bbKey === newItem.bbKey)
      );

      let newData = [...updatedData];
      if (nonMatchingInterfaceItems) {
        newData = [...updatedData, ...nonMatchingInterfaceItems];
      }

      if (nonMatchingRequirementItems) {
        newData = [...updatedData, ...nonMatchingRequirementItems];
      }

      setAllData(
        newData.filter((item) => Boolean(item)) as ComplianceRequirementsType[]
      );
    }
  }, [updatedInterfaceData, updatedRequirementSpecData]);

  useEffect(() => {
    setUpdatedBBs(allData);
  }, [allData]);

  const isValidArray = (data: ComplianceRequirementsType[]): boolean => {
    return data.every((item) => {
      if (item.requirements) {
        // Check crossCutting and functional arrays
        const isCrossCuttingValid = item?.requirements.crossCutting.every(
          (crossCuttingItem) => {
            if (crossCuttingItem.status === 0) {
              return crossCuttingItem.fulfillment !== -1;
            } else {
              return true;
            }
          }
        );

        const isFunctionalValid = item?.requirements.functional.every(
          (functionalItem) => {
            if (functionalItem.status === 0) {
              return functionalItem.fulfillment !== -1;
            } else {
              return true;
            }
          }
        );

        // Check interfaceCompliance.requirements array
        let isInterfaceValid;
        if (item.interfaceCompliance && item.interfaceCompliance.requirements) {
          isInterfaceValid =
            item.interfaceCompliance.requirements.length === 0 ||
            item.interfaceCompliance.requirements.every((interfaceItem) => {
              if (interfaceItem.status === 0) {
                return (
                  interfaceItem.fulfillment !== -1 &&
                  item.interfaceCompliance.testHarnessResult !== undefined &&
                  item.interfaceCompliance.testHarnessResult !== ''
                );
              } else {
                return true;
              }
            });
        } else {
          return true;
        }

        return isCrossCuttingValid && isFunctionalValid && isInterfaceValid;
      } else {
        return true;
      }
    });
  };

  useEffect(() => {
    if (allData) {
      onEdited(!isValidArray(allData));
    }
  }, [allData]);

  return (
    <div className="irsc-form-container">
      <div className="irsc-header">
        {format('form.fill_in_at_least_1_of_the_below_forms.label')}
      </div>
      <div className="irsc-tab-selector">
        <div
          className={classNames('irsc-single-tab', {
            active: activeTab === 'interface',
          })}
          onClick={() => setActiveTab('interface')}
        >
          {format('table.interface_compliance.label')}
        </div>
        <div
          className={classNames('irsc-single-tab', {
            active: activeTab === 'specification',
          })}
          onClick={() => setActiveTab('specification')}
        >
          {format('table.requirement_specification_compliance.label')}
        </div>
      </div>
      <InterfaceCompliance
        setUpdatedBBs={setUpdatedInterfaceData}
        IRSCFormRef={IRSCInterfaceFormRef}
        display={activeTab === 'interface'}
      />
      <RequirementSpecificationComplianceForm
        setUpdatedBBs={setUpdatedRequirementSpecData}
        IRSCRequirementsFormRef={IRSCRequirementsFormRef}
        display={activeTab === 'specification'}
      />
    </div>
  );
};

export default IRSForm;
