import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import InterfaceCompliance from './InterfaceCompliance';
import SpecificationCompliance from './SpecificationCompliance';

type activeTabProps = 'interface' | 'specification'

const IRSCompliance = ({ setUpdatedBBs }) => {
  const { formatMessage } = useIntl();
  const format = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

  const [activeTab, setActiveTab] = useState<activeTabProps>('interface');

  return (
    <div>
      <div className='irsc-header'>{format('form.fill_in_at_least_1_of_the_below_forms.label')}</div>
      <div className='irsc-tab-selector'>
        <div
          className={classNames('irsc-single-tab', { 'active': activeTab === 'interface' })}
          onClick={() => setActiveTab('interface')}
        >
          {format('table.interface_compliance.label')}
        </div>
        <div
          className={classNames('irsc-single-tab', { 'active': activeTab === 'specification' })}
          onClick={() => setActiveTab('specification')}
        >
          {format('table.requirement_specification_compliance.label')}
        </div>
      </div>
      {activeTab === 'interface' && (
        <InterfaceCompliance
          setUpdatedBBs={setUpdatedBBs}
        />
      )}
      {activeTab === 'specification' && <SpecificationCompliance />}
    </div>
  );
};

export default IRSCompliance;
