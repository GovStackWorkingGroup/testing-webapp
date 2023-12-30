import classNames from 'classnames';
import React from 'react';
import { Tooltip } from 'react-tooltip';

type Props = {
  customStyle?: string;
};

const TextTooltip = ({ customStyle }: Props) => {

  return (
    <div
      className='text-tooltip'
    >
      <Tooltip
        id='text-tooltip'
        className={classNames('text-tooltip-body', customStyle)}
        closeOnScroll={true}
      />
    </div>
  );
};

export default TextTooltip;
