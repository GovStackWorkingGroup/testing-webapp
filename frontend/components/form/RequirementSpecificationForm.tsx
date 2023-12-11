import { RefObject, useEffect, useState } from 'react';
import useTranslations from '../../hooks/useTranslation';
import { ComplianceRequirementsType } from '../../service/types';
import { getComplianceRequirements } from '../../service/serviceAPI';
import { IRSCFormRef } from '../shared/combined/SelectBBs';
import RequirementSpecificationSelectBBs from '../shared/combined/RequirementSpecificationSelectBB';

type RequirementSpecificationComplianceFormProps = {
  setUpdatedBBs: (data: ComplianceRequirementsType[] | undefined) => void;
  IRSCRequirementsFormRef: RefObject<IRSCFormRef>;
};

const RequirementSpecificationComplianceForm = ({
  setUpdatedBBs,
  IRSCRequirementsFormRef,
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
    <div>
      <div className="interface-bb-selector">
        <p className="text-18">{format('form.select_building_blocks.label')}</p>
        <RequirementSpecificationSelectBBs
          interfaceRequirementsData={interfaceRequirementsData}
          setUpdatedBBs={setUpdatedData}
          IRSCRequirementsFormRef={IRSCRequirementsFormRef}
        />
      </div>
    </div>
  );
};

export default RequirementSpecificationComplianceForm;
