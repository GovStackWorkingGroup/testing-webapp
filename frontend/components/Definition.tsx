import React from 'react';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import { formatTranslationType } from '../service/types';

type DefinitionType = {
  title: string | formatTranslationType;
  hasRedirecting?: boolean;
  description: string | formatTranslationType;
  descriptionPartTwo?: string;
  note?: string | formatTranslationType;
  customStyle?: string;
};

const Definition = ({
  title,
  hasRedirecting = false,
  description,
  descriptionPartTwo,
  note,
  customStyle,
}: DefinitionType) => (
  <div className={classNames('definition-section', customStyle)}>
    <p className="definition-title" data-testid="definition-title">
      {title}
    </p>
    <div data-testid="definition-description">
      {hasRedirecting ? (
        <div>
          <ReactMarkdown className="definition-description" linkTarget="_blank">
            {description || ''}
          </ReactMarkdown>
          <ReactMarkdown className="definition-description" linkTarget="_blank">
            {descriptionPartTwo || ''}
          </ReactMarkdown>
        </div>
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
