import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import useTranslations from '../../hooks/useTranslation';

interface TableCellProps {
    row: any;
    expanded?: boolean
}

const TableCells = ({ row, expanded = false }: TableCellProps) => {

  const { format } = useTranslations();

  const [isTextTruncated, setIsTextTruncated] = useState<boolean>(expanded);
  const [isTruncatable, setIsTruncatable] = useState<boolean>(false);
  const textRef = useRef<HTMLDivElement>(null);

  const handleIsTextTruncated = () => setIsTextTruncated(!isTextTruncated);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const { scrollHeight, clientHeight } = textRef.current;
        setIsTruncatable(scrollHeight > clientHeight);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);

    return () => {
      window.removeEventListener('resize', checkTruncation);
    };
  }, []);

  return row.cells.map((cell: any, indexKey: number) => {
    if (indexKey === 0) {
      return (
        <td {...cell.getCellProps()} key={`cell-td-${indexKey}`}>
          <div>
            <div
              ref={textRef}
              className={classNames('truncate-text-3', { 'remove-truncate': isTextTruncated })}
            >
              {cell.render('Cell')}
            </div>
          </div>
          <div className='description-buttons'>
            <div>
              <Link href={cell.row.original.link} className='description-buttons' target="_blank" rel="noopener noreferrer">
              Go to requirement
              </Link>
            </div>
            {isTruncatable && (
              <div onClick={handleIsTextTruncated}>
                {!isTextTruncated ? format('text.showMore') : format('text.showLess')}
              </div>
            )}
          </div>
        </td>
      );
    } else {
      return (
        <td {...cell.getCellProps()} key={`cell-td-${indexKey}`}>
          {cell.render('Cell')}
        </td>
      );
    }
  });

};

export default TableCells;

