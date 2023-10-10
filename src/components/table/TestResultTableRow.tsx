import classNames from 'classnames';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { BuildingBlockEndpointTest } from '../../service/types';
import TextTooltip from '../TextTooltip';

type Props = {
  bbTest: BuildingBlockEndpointTest;
  passCurrentBBTest: () => void
};

const TestResultTableRow = ({ bbTest, passCurrentBBTest }: Props) => {
  const endpointTextContainer = React.useRef<HTMLDivElement>(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState<boolean>(false);

  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  const handleTextOverflowing = useCallback(() => {
    const bbContainer = endpointTextContainer.current;
    if (bbContainer && (bbContainer.clientWidth < bbContainer.scrollWidth)) {
      setIsTextOverflowing(true);
    } else {
      setIsTextOverflowing(false);
    }
  }, [endpointTextContainer]);

  useEffect(handleTextOverflowing, [handleTextOverflowing]);

  useEffect(
    () => window.addEventListener('resize', debounce(handleTextOverflowing, 20)),
    [handleTextOverflowing]
  );

  return (
    <div className='test-table-row' onClick={passCurrentBBTest}>
      {bbTest?.passed ? (
        <div className='test-table-row-status status-passed' data-testid='bb-test-passed'>
          <p>{format('test_table.passed')}</p>
        </div>
      ) : (
        <div className='test-table-row-status status-failed' data-testid='bb-test-failed'>
          <p>{format('test_table.failed')}</p>
        </div>
      )}
      <div
        className={classNames({ 'test-table-row-category': bbTest?.method !== '', })}
        data-testid='bb-test-category'>{bbTest?.method === '' ? '-' : bbTest?.method}
      </div>
      <div
        className='test-table-row-endpoint'
        data-testid='bb-test-endpoint'
        data-tooltip-id={isTextOverflowing ? 'text-tooltip' : undefined}
        data-tooltip-content={isTextOverflowing ? bbTest?.endpoint : undefined}
      >
        <p ref={endpointTextContainer}>{bbTest?.endpoint === '' ? '-' : bbTest?.endpoint}</p>
        {isTextOverflowing ? <TextTooltip customStyle='row-endpoint-tooltip' /> : null}
      </div>
    </div>
  );
};

export default TestResultTableRow;
