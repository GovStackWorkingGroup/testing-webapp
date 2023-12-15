import classNames from 'classnames';
import { useEffect, useState } from 'react';
import useTranslations from '../../hooks/useTranslation';
import SelectBBs from '../shared/combined/SelectBBs';
import { getComplianceRequirements } from '../../service/serviceAPI';
import { ComplianceRequirementsType } from '../../service/types';
import RequirementSpecificationSelectBBs from '../shared/combined/RequirementSpecificationSelectBB';

type activeTabProps = 'deployment' | 'interface' | 'specification';

const ReportViewDetail = () => {
  const [activeTab, setActiveTab] = useState<activeTabProps>('deployment');
  const [requirementsData, setRequirementsData] =
    useState<ComplianceRequirementsType[]>();

  const { format } = useTranslations();

  useEffect(() => {
    fetchRequirementsData();
  }, []);

  const fetchRequirementsData = async () => {
    const data = await getComplianceRequirements();
    if (data.status) {
      setRequirementsData(data.data);
    }
  };

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
            <p>{format('details_view.documentation_description.label')}</p>
            <div>tu będzie link</div>
          </div>
          <div>
            <p>{format('details_view.container_description.label')}</p>
            <div>tu będzie link</div>
          </div>
        </div>
      )}
      {activeTab === 'interface' && (
        <SelectBBs
          interfaceRequirementsData={requirementsData}
          setUpdatedBBs={() => {}}
          readOnlyView={true}
        />
      )}
      {activeTab === 'specification' && (
        <RequirementSpecificationSelectBBs
          interfaceRequirementsData={requirementsData}
          setUpdatedBBs={() => {}}
          readOnlyView={true}
        />
      )}
    </div>
  );
};

export default ReportViewDetail;
