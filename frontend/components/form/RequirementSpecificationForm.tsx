import React, { RefObject, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import useTranslations from '../../hooks/useTranslation';
import { ComplianceRequirementsType } from '../../service/types';
import { getComplianceRequirements } from '../../service/serviceAPI';
import { IRSCFormRef } from '../shared/combined/SelectBBs';
import RequirementSpecificationSelectBBs from '../shared/combined/RequirementSpecificationSelectBB';

type RequirementSpecificationComplianceFormProps = {
  setUpdatedBBs: (data: ComplianceRequirementsType[] | undefined) => void;
  IRSCRequirementsFormRef: RefObject<IRSCFormRef>;
  display: boolean;
};

const RequirementSpecificationComplianceForm = ({
  setUpdatedBBs,
  IRSCRequirementsFormRef,
  display,
}: RequirementSpecificationComplianceFormProps) => {
  const [interfaceRequirementsData, setInterfaceRequirementsData] =
    useState<ComplianceRequirementsType[]>();
  const [updatedData, setUpdatedData] = useState<
    ComplianceRequirementsType[] | undefined
  >();

  const { format } = useTranslations();

  useEffect(() => {
    setUpdatedBBs(updatedData);
  }, [updatedData]);

  const fetchData = async () => {
    const data = await getComplianceRequirements();
    if (data.status) {
      setInterfaceRequirementsData(data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: display ? 'block' : 'none' }}>
      <div className="interface-bb-selector">
        <ReactMarkdown className="definition-description" linkTarget="_blank">
          {`${format('form.select_building_blocks.top.label')}`}
        </ReactMarkdown>
        <ol>
          <li>
            <p className="definition-description">{format('form.select_building_blocks.list.first.label')}</p>
          </li>
          <li>
            <p className="definition-description">{format('form.select_building_blocks.list.second.label')}</p>
          </li>
          <li>
            <p className="definition-description">{format('form.select_building_blocks.list.third.label')}</p>
          </li>
        </ol>
        <p className="definition-description">{format('form.select_building_blocks.bottom.label')}</p>
        <RequirementSpecificationSelectBBs
          interfaceRequirementsData={interfaceRequirementsData}
          setUpdatedBBs={setUpdatedData}
          IRSCRequirementsFormRef={IRSCRequirementsFormRef}
          isFormActive={true}
        />
      </div>
    </div>
  );
};

export default RequirementSpecificationComplianceForm;
