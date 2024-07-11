import React, { RefObject, useEffect, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
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
      <div className="interface-bb-selector">
        {/* @ts-ignore */}
        <ReactMarkdown className="definition-description" linkTarget="_blank">
          {format('form.select_building_blocks.api.top.label.part_1')}
        </ReactMarkdown>
        <ReactMarkdown className="definition-description" linkTarget="_blank">
          {format('form.select_building_blocks.api.top.label.part_1') + ''}
        </ReactMarkdown>
        <ol>
          <li>
            <p className="definition-description">{format('form.select_building_blocks.api.list.first.label')}</p>
          </li>
          <li>
            <p className="definition-description">{format('form.select_building_blocks.api.list.second.label')}</p>
          </li>
          <li>
            <p className="definition-description">{format('form.select_building_blocks.api.list.third.label')}</p>
          </li>
          <li>
            <p className="definition-description">{format('form.select_building_blocks.api.list.fourth.label')}</p>
          </li>
        </ol>
        <p className="definition-description">{format('form.select_building_blocks.bottom.label')}</p>
        <SelectBBs
          interfaceRequirementsData={interfaceRequirementsData}
          setUpdatedBBs={setUpdatedData}
          IRSCFormRef={IRSCFormRef}
          isFormActive={true}
        />
      </div>
    </div>
  );
};

export default InterfaceComplianceForm;
