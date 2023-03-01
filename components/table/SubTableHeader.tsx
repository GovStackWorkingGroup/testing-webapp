import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';

const SubTableHeader = () => {
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  return (
    <div className='sub-table-header'>
      <div></div>
      <div data-testid='bb-label'>
        <p>{format('building_block.label')}</p>
      </div>
      <div className='sub-table-content-tests'>
        <div data-testid='test-passed-label'>
          <p>{format('app.tests_passed.label')}</p>
        </div>
        <div data-testid='test-failed-label'>
          <p>{format('app.tests_failed.label')}</p>
        </div>
      </div>
      <div data-testid='compatibility-label'>
        <p>{format('app.compatibility.label')}</p>
      </div>
      <div></div>
    </div>
  );
};

export default SubTableHeader;
