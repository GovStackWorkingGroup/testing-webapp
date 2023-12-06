import { RefObject, useEffect, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Link from 'next/link';
import SelectBBs, { IRSCFormRef } from '../shared/combined/SelectBBs';
import { getComplianceRequirements } from '../../service/serviceAPI';
import { ComplianceRequirementsType } from '../../service/types';
import useTranslations from '../../hooks/useTranslation';

type InterfaceComplianceFormProps = {
  setUpdatedBBs: (data: ComplianceRequirementsType[] | undefined) => void;
  IRSCFormRef: RefObject<IRSCFormRef>;
};

const InterfaceComplianceForm = ({
  setUpdatedBBs,
  IRSCFormRef,
}: InterfaceComplianceFormProps) => {
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
      <div className="question-line">
        <AiOutlineQuestionCircle size={24} color="#325BE3" />
        <p className="question-line-text">
          {format('form.question_line.not_sure_how_to_start')}
          {format('form.question_line.click')}
          <Link className="question-line-link" href="">
            {format('form.question_line.here')}
          </Link>
          {format(
            'form.question_line.and_see_instructions_on_how_to_configure_interface_compliance'
          )}
        </p>
      </div>
      <div className="interface-bb-selector">
        <p className="text-18">{format('form.select_building_blocks.label')}</p>
        <SelectBBs
          interfaceRequirementsData={interfaceRequirementsData}
          setUpdatedBBs={setUpdatedData}
          IRSCFormRef={IRSCFormRef}
        />
      </div>
    </div>
  );
};

export default InterfaceComplianceForm;
