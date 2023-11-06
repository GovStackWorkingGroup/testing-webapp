import React from 'react';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';

type DefinitionType = {
  title: string;
  hasRedirecting?: boolean;
  description: string;
  note?: string;
  customStyle?: string;
};

const Definition = ({
  title,
  hasRedirecting = false,
  description,
  note,
  customStyle,
}: DefinitionType) => (
  <div className={classNames('definition-section', customStyle)}>
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
        {note}
      </p>
    )}
  </div>
);

export default Definition;
