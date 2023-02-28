import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';

const Definition = () => {
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  return (
    <div className='definition-section'>
      <p className='definition-title' data-testid='definition-title'>{format('app.definition.title')}</p>
      <p
        className='definition-description'
        dangerouslySetInnerHTML={{
          __html: format('app.definition.description'),
        }}
        data-testid='definition-description'
      />
      <p className='definition-note' data-testid='definition-note'>{format('app.definition.note')}</p>
    </div>
  );
};

export default Definition;
