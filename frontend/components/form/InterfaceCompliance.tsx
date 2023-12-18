import { RefObject, useEffect, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Link from 'next/link';
import SelectBBs, { IRSCFormRef } from '../shared/combined/SelectBBs';
import { getComplianceRequirements } from '../../service/serviceAPI';
import { ComplianceRequirementsType } from '../../service/types';
import useTranslations from '../../hooks/useTranslation';
import { CONFLUENCE_INSTRUCTIONS_LINK } from '../../service/constants';

type InterfaceComplianceFormProps = {
  setUpdatedBBs: (data: ComplianceRequirementsType[] | undefined) => void;
  IRSCFormRef: RefObject<IRSCFormRef>;
  display: boolean;
};

const InterfaceComplianceForm = ({
  setUpdatedBBs,
  IRSCFormRef,
  display,
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
    <div style={{ display: display ? 'block' : 'none' }}>
      <div className="question-line">
        <AiOutlineQuestionCircle className="form-question-mark-icon" />
        <p className="question-line-text">
          {format('form.question_line.not_sure_how_to_start')}
          {format('form.question_line.click')}
          <Link
            className="question-line-link"
            href={CONFLUENCE_INSTRUCTIONS_LINK}
            target="_blank"
          >
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
