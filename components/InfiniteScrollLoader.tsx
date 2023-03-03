import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';

const InfiniteScrollCustomLoader = () => {
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  return (
    <p className='data-loader-message' data-testid='scroll-loader'>
      {format('app.scroll-loader.message')}
    </p>
  );
};

export default InfiniteScrollCustomLoader;
