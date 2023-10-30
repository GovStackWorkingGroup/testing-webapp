import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';

const TableErrorHandling = () => {
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  return (
    <div className='table-error-handling' data-testid='table-error'>
      <p>{format('app.error_fetching_data.message')}</p>
    </div>
  );
};

export default TableErrorHandling;
