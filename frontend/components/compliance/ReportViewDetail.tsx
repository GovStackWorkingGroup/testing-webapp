import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useTranslations from '../../hooks/useTranslation';
import SelectBBs from '../shared/combined/SelectBBs';
import {
  getComplianceRequirements,
  getSoftwareDetailsReport,
} from '../../service/serviceAPI';
import {
  ComplianceRequirementsType,
  SoftwareDetailsDataType,
} from '../../service/types';
import RequirementSpecificationSelectBBs from '../shared/combined/RequirementSpecificationSelectBB';

type activeTabProps = 'deployment' | 'interface' | 'specification';

const ReportViewDetail = () => {
  const [activeTab, setActiveTab] = useState<activeTabProps>('deployment');
  const [requirementsData, setRequirementsData] =
    useState<ComplianceRequirementsType[]>();
  const [softwareDetailsData, setSoftwareDetailsData] =
    useState<SoftwareDetailsDataType>();

  const { format } = useTranslations();
  const router = useRouter();
  const { softwareId } = router.query;

  useEffect(() => {
    fetchRequirementsData();
  }, []);

  useEffect(() => {
    fetchSoftwareDetailsData();
  }, [softwareId]);

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

  console.log(
    'test',
    softwareDetailsData?.formDetails[0].deploymentCompliance
      ?.deploymentCompliance
  );

  return (
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
        <div>
          <div>
            <p className="table-container-name">
              {format('details_view.documentation_description.label')}
            </p>
            <Link
              href={
                softwareDetailsData?.formDetails[0].deploymentCompliance
                  ?.deploymentCompliance ?? ''
              }
            >
              {softwareDetailsData?.formDetails[0].deploymentCompliance
                ?.deploymentCompliance ?? ''}
            </Link>
          </div>
          <div>
            <p className="table-container-name">
              {format('details_view.container_description.label')}
            </p>
            <div>tu będzie link</div>
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
  );
};

export default ReportViewDetail;
