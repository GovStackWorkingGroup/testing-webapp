import { RefObject, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  ComplianceRequirementsType,
  RequirementsType,
} from '../../service/types';
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
  const [activeTab, setActiveTab] = useState<activeTabProps>('specification');
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
    if (
      !allData?.length &&
      updatedInterfaceData &&
      updatedInterfaceData.length > 0
    ) {
      const updatedData = updatedInterfaceData.map((data) => {
        return {
          ...data,
          requirements: { crossCutting: [], functional: [], interface: [], keyDigitalFunctionalities: [] },
        };
      });
      setAllData(updatedData);

      return;
    }

    if (
      !allData?.length &&
      updatedRequirementSpecData &&
      updatedRequirementSpecData.length > 0
    ) {
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
        newData = [...newData, ...nonMatchingInterfaceItems];
      }

      if (nonMatchingRequirementItems) {
        newData = [...newData, ...nonMatchingRequirementItems];
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
    const validateResultArray = data.map((item) => {
      let isCrossCuttingValid;
      let isFunctionalValid;
      let isKDFValid;
      let isInterfaceValid;

      const validateData = (data: RequirementsType[]): boolean => {
        if (data) {
          return data.every((item) => {
            if (item.status === 0) {
              return item.fulfillment !== -1 && item.fulfillment !== null;
            } else {
              return true;
            }
          });
        } else {
          return true;
        }
      };

      if (
        item.requirements &&
        item.requirements.crossCutting &&
        item.interfaceCompliance
      ) {
        isCrossCuttingValid = validateData(item.requirements.crossCutting);
        isFunctionalValid = validateData(item.requirements.functional);
        isKDFValid = validateData(item.requirements.keyDigitalFunctionalities);
        if (
          item.interfaceCompliance.requirements &&
          item.interfaceCompliance.requirements.length
        ) {
          isInterfaceValid =
            validateData(item.interfaceCompliance.requirements) &&
            item.interfaceCompliance.testHarnessResult !== undefined &&
            item.interfaceCompliance.testHarnessResult !== '';
        } else {
          isInterfaceValid = true;
        }
      }

      return isCrossCuttingValid && isFunctionalValid && isInterfaceValid && isKDFValid;
    });

    return validateResultArray.every((item) => item);
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
            active: activeTab === 'specification',
          })}
          onClick={() => setActiveTab('specification')}
        >
          {format('table.requirement_specification_compliance.label')}
        </div>
        <div
          className={classNames('irsc-single-tab', {
            active: activeTab === 'interface',
          })}
          onClick={() => setActiveTab('interface')}
        >
          {format('table.interface_compliance.label')}
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
