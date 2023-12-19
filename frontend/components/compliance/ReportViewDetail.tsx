import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RiFileTextLine } from 'react-icons/ri';
import useTranslations from '../../hooks/useTranslation';
import SelectBBs from '../shared/combined/SelectBBs';
import {
  baseUrl,
  getComplianceRequirements,
  getSoftwareDetailsReport,
} from '../../service/serviceAPI';
import {
  ComplianceRequirementsType,
  SoftwareDetailsDataType,
} from '../../service/types';
import RequirementSpecificationSelectBBs from '../shared/combined/RequirementSpecificationSelectBB';
import BackToPageButton from '../shared/buttons/BackToPageButton';
import { COMPLIANCE_TESTING_RESULT_PAGE } from '../../service/constants';

type activeTabProps = 'deployment' | 'interface' | 'specification';

const ReportViewDetail = () => {
  const [activeTab, setActiveTab] = useState<activeTabProps>('deployment');
  const [requirementsData, setRequirementsData] =
    useState<ComplianceRequirementsType[]>();
  const [softwareDetailsData, setSoftwareDetailsData] =
    useState<SoftwareDetailsDataType>();
  const [documentationLink, setDocumentationLink] = useState('');
  const [instructionLink, setInstructionLink] = useState('');

  const { format } = useTranslations();
  const router = useRouter();
  const { softwareId } = router.query;

  useEffect(() => {
    fetchRequirementsData();
  }, []);

  useEffect(() => {
    fetchSoftwareDetailsData();
  }, [softwareId]);

  useEffect(() => {
    const documentationData =
      softwareDetailsData?.formDetails[0].deploymentCompliance;
    if (documentationData) {
      const documentation =
        softwareDetailsData?.formDetails[0].deploymentCompliance.documentation;
      const instruction =
        softwareDetailsData?.formDetails[0].deploymentCompliance
          .deploymentInstructions;

      if (documentation.startsWith('uploads/')) {
        setDocumentationLink(`${baseUrl}/${documentation}`);
      } else {
        setDocumentationLink(documentation);
      }

      if (instruction.startsWith('uploads/')) {
        setInstructionLink(`${baseUrl}/${instruction}`);
      } else {
        setInstructionLink(instruction);
      }
    }
  }, [softwareDetailsData]);

  const fetchRequirementsData = async () => {
    const data = await getComplianceRequirements();
    if (data.status) {
      setRequirementsData(data.data);
    }
  };

  const fetchSoftwareDetailsData = async () => {
    if (softwareId) {
      const data = await getSoftwareDetailsReport(softwareId as string);
      if (data.status) {
        setSoftwareDetailsData(data.data);
      }
    }
  };

  return (
    <>
      <div className="back-to-btn-container">
        <BackToPageButton
          text={format('app.back_to_reports_list.label')}
          href={COMPLIANCE_TESTING_RESULT_PAGE}
        />
      </div>
      <div className="report-detail-container">
        <div className="report-detail-tab-selector">
          <div
            className={classNames('report-detail-single-tab', {
              active: activeTab === 'deployment',
            })}
            onClick={() => setActiveTab('deployment')}
          >
            {format('table.deployment_compliance.label')}
          </div>
          <div
            className={classNames('report-detail-single-tab', {
              active: activeTab === 'interface',
            })}
            onClick={() => setActiveTab('interface')}
          >
            {format('table.interface_compliance.label')}
          </div>
          <div
            className={classNames('report-detail-single-tab', {
              active: activeTab === 'specification',
            })}
            onClick={() => setActiveTab('specification')}
          >
            {format('table.requirement_specification_compliance.label')}
          </div>
        </div>
        {activeTab === 'deployment' && (
          <div className="report-detail-deployment-container">
            <div>
              <Link
                target="_blank"
                href={documentationLink}
                rel="noopener noreferrer"
              >
                <RiFileTextLine className="report-view-doc-icon" />
              </Link>
              <p>{format('details_view.documentation_description.label')}</p>
            </div>
            <div>
              <Link
                target="_blank"
                href={instructionLink}
                rel="noopener noreferrer"
              >
                <RiFileTextLine className="report-view-doc-icon" />
              </Link>
              <p>{format('details_view.container_description.label')}</p>
            </div>
          </div>
        )}
        {activeTab === 'interface' && (
          <SelectBBs
            interfaceRequirementsData={requirementsData}
            readOnlyView={true}
            readOnlyData={softwareDetailsData}
          />
        )}
        {activeTab === 'specification' && (
          <RequirementSpecificationSelectBBs
            interfaceRequirementsData={requirementsData}
            readOnlyView={true}
            readOnlyData={softwareDetailsData}
          />
        )}
      </div>
    </>
  );
};

export default ReportViewDetail;
