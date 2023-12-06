import { RefObject, useEffect, useState } from 'react';
import classNames from 'classnames';
import { ComplianceRequirementsType } from '../../service/types';
import useTranslations from '../../hooks/useTranslation';
import { IRSCFormRef } from '../shared/combined/SelectBBs';
import InterfaceCompliance from './InterfaceCompliance';
import SpecificationCompliance from './SpecificationCompliance';

type activeTabProps = 'interface' | 'specification';

type IRSFormProps = {
  setUpdatedBBs: (data: ComplianceRequirementsType[] | undefined) => void;
  IRSCFormRef: RefObject<IRSCFormRef>;
};

const IRSForm = ({ setUpdatedBBs, IRSCFormRef }: IRSFormProps) => {
  const [activeTab, setActiveTab] = useState<activeTabProps>('interface');
  const [updatedData, setUpdatedData] = useState<
    ComplianceRequirementsType[] | undefined
  >();

  const { format } = useTranslations();

  useEffect(() => {
    setUpdatedBBs(updatedData);
  }, [updatedData]);

  return (
    <div>
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
      {activeTab === 'interface' && (
        <InterfaceCompliance
          setUpdatedBBs={setUpdatedData}
          IRSCFormRef={IRSCFormRef}
        />
      )}
      {activeTab === 'specification' && <SpecificationCompliance />}
    </div>
  );
};

export default IRSForm;
