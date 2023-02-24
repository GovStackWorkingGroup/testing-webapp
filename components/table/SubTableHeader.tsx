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
      <div>
        <p>{format('building_block.label')}</p>
      </div>
      <div className='sub-table-content-tests'>
        <div>
          <p>{format('app.tests_passed.label')}</p>
        </div>
        <div>
          <p>{format('app.tests_failed.label')}</p>
        </div>
      </div>
      <div>
        <p>{format('app.compatibility.label')}</p>
      </div>
      <div></div>
    </div>
  );
};

export default SubTableHeader;
