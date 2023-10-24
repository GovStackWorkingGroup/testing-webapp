import React from 'react';
import ReactMarkdown from 'react-markdown';
import useTranslations from '../hooks/useTranslation';

type DefinitionType = {
  title: string;
  hasRedirecting?: boolean;
  description: string;
  note?: string;
};

const Definition = ({
  title,
  hasRedirecting = false,
  description,
  note,
}: DefinitionType) => {
  const { format } = useTranslations();

  return (
    <div className="definition-section">
      <p className="definition-title" data-testid="definition-title">
        {title}
      </p>
      <div data-testid="definition-description">
        {hasRedirecting ? (
          <ReactMarkdown className="definition-description" linkTarget="_blank">
            {description}
          </ReactMarkdown>
        ) : (
          <div className="definition-description">{description}</div>
        )}
      </div>
      {note && (
        <p className="definition-note" data-testid="definition-note">
          {format('app.definition.note')}
        </p>
      )}
    </div>
  );
};

export default Definition;
