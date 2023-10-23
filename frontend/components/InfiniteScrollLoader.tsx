import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

const Spinner = () => (
  <div className="spinner">
    <div className="loader"></div>
  </div>
);

const InfiniteScrollCustomLoader = () => {
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <div className='data-loader-message' data-testid='scroll-loader'>
      <Spinner/> {format('app.scroll-loader.message')}
    </div>
  );
};

export default InfiniteScrollCustomLoader;
