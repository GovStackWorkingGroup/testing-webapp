import { useCallback } from 'react';
import { useIntl } from 'react-intl';

const useTranslations = () => {
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  return { format };
};

export default useTranslations;
