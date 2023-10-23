import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import ReactMarkdown from 'react-markdown';

const Definition = () => {
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  return (
    <div className='definition-section'>
      <p className='definition-title' data-testid='definition-title'>
        {format('app.definition.title')}
      </p>
      <div data-testid='definition-description'>
        <ReactMarkdown className='definition-description' linkTarget="_blank">
          {format('app.definition.description')}
        </ReactMarkdown>
      </div>
      <p className='definition-note' data-testid='definition-note'>
        {format('app.definition.note')}
      </p>
    </div>
  );
};

export default Definition;
