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
};

const IRSForm = ({
  setUpdatedBBs,
  IRSCInterfaceFormRef,
  IRSCRequirementsFormRef,
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
      setAllData(updatedInterfaceData);

      return;
    }

    if (allData?.length && updatedInterfaceData) {
      const updatedData = allData.map((item) => {
        const matchingItem = updatedInterfaceData.find(
          (nextItem) => nextItem.bbKey === item.bbKey
        );

        if (matchingItem) {
          return {
            ...item,
            interfaceCompliance: {
              ...item.interfaceCompliance,
              testHarnessResult:
                matchingItem.interfaceCompliance?.testHarnessResult || '',
              requirements: matchingItem.requirements,
            },
          };
        }

        return item;
      });
      const nonMatchingItems = updatedInterfaceData.filter(
        (newItem) => !allData.find((item) => item.bbKey === newItem.bbKey)
      );
      const newData = [...updatedData, ...nonMatchingItems];
      setAllData(newData);
    }
  }, [updatedInterfaceData]);

  useEffect(() => {
    if (!allData?.length && updatedRequirementSpecData) {
      setAllData(updatedRequirementSpecData);

      return;
    }

    if (allData?.length && updatedRequirementSpecData) {
      const updatedData = allData.map((item) => {
        const matchingItem = updatedRequirementSpecData.find(
          (newItem) => newItem.bbKey === item.bbKey
        );
        if (matchingItem) {
          return {
            ...item,
            requirements: {
              ...item.requirements,
              crossCutting: matchingItem.requirements.crossCutting,
              functional: matchingItem.requirements.functional,
            },
          };
        }

        return item;
      });

      const nonMatchingItems = updatedRequirementSpecData.filter(
        (newItem) => !allData.find((item) => item.bbKey === newItem.bbKey)
      );

      const newData = [...updatedData, ...nonMatchingItems];

      setAllData(newData);
    }
  }, [updatedRequirementSpecData]);

  useEffect(() => {
    setUpdatedBBs(allData);
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
      {/* {activeTab === 'interface' && ( */}
      <InterfaceCompliance
        setUpdatedBBs={setUpdatedInterfaceData}
        IRSCFormRef={IRSCInterfaceFormRef}
      />
      {/* )} */}
      {/* {activeTab === 'specification' && ( */}
      <RequirementSpecificationComplianceForm
        setUpdatedBBs={setUpdatedRequirementSpecData}
        IRSCRequirementsFormRef={IRSCRequirementsFormRef}
      />
      {/* )} */}
    </div>
  );
};

export default IRSForm;
