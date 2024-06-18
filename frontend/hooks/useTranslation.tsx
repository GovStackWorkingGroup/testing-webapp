import { useCallback } from 'react';
import { useIntl } from 'react-intl';

type Values = { [key: string]: string | number | boolean | Date | null | undefined };

const useTranslations = () => {
  const { formatMessage } = useIntl();
  const format = useCallback((id: string, values?: Values) => formatMessage({ id }, values), [formatMessage]);

  return { format };
};

export default useTranslations;
