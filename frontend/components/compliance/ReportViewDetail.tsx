import classNames from 'classnames';
import { useState } from 'react';
import useTranslations from '../../hooks/useTranslation';

type activeTabProps = 'deployment' | 'interface' | 'specification';

const ReportViewDetail = () => {
  const [activeTab, setActiveTab] = useState<activeTabProps>('deployment');

  const { format } = useTranslations();

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
          <div>documentation on how to install and deploy software</div>
          <div>
            container that show that the product can be run in a container
            system (usually Docker and/or Kubernetes)
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportViewDetail;
