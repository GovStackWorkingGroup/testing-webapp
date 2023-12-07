import { useEffect, useState } from 'react';
import useTranslations from '../../hooks/useTranslation';
import { ComplianceRequirementsType } from '../../service/types';
import { getComplianceRequirements } from '../../service/serviceAPI';
import SelectBBs from '../shared/combined/SelectBBs';
import RequirementSelectBBs from '../shared/combined/RequirrmentSpecificationBB';

const RequirementSpecificationComplianceForm = () => {
  const [interfaceRequirementsData, setInterfaceRequirementsData] =
    useState<ComplianceRequirementsType[]>();
  const [updatedData, setUpdatedData] = useState<
    ComplianceRequirementsType[] | undefined
  >();

  const { format } = useTranslations();

  // useEffect(() => {
  //   setUpdatedBBs(updatedData);
  // }, [updatedData]);

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
        <RequirementSelectBBs
          interfaceRequirementsData={interfaceRequirementsData}
          setUpdatedBBs={setUpdatedData}
          // IRSCFormRef={IRSCFormRef}
        />
      </div>
    </div>
  );
};

export default RequirementSpecificationComplianceForm;
