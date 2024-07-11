import React from 'react';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import { formatTranslationType } from '../service/types';
import children = ReactMarkdown.propTypes.children;

type DefinitionType = {
  title: formatTranslationType;
  hasRedirecting?: boolean;
  description?: formatTranslationType;
  descriptionPartTwo?: formatTranslationType;
  note?: formatTranslationType;
  customStyle?: string;
  children?: React.ReactNode;
};

const Definition = ({
  title,
  hasRedirecting = false,
  description,
  descriptionPartTwo,
  note,
  customStyle,
  children
}: DefinitionType) => (
  <div className={classNames('definition-section', customStyle)}>
    <p className="definition-title" data-testid="definition-title">
      {title}
    </p>
    <div data-testid="definition-description">
      {hasRedirecting ? (
        <div>
          <ReactMarkdown className="definition-description" linkTarget="_blank">
            {`${description}`}
          </ReactMarkdown>
          <ReactMarkdown className="definition-description" linkTarget="_blank">
            {`${descriptionPartTwo}`}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="definition-description">{description}</div>
      )}
      {children}
    </div>
    {note && (
      <p className="definition-note" data-testid="definition-note">
        {note}
      </p>
    )}
  </div>
);

export default Definition;
