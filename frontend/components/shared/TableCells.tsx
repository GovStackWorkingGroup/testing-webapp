import ShowMoreText from 'react-show-more-text';
import React from 'react';
import useTranslations from '../../hooks/useTranslation';

interface TableCellProps {
    row: any;
    expanded?: boolean
}

const TableCells = ({ row, expanded = false }: TableCellProps) => {

  const { format } = useTranslations();

  return row.cells.map((cell: any, indexKey: number) => {
    if (indexKey === 0) {
      return (
        <td {...cell.getCellProps()} key={`cell-td-${indexKey}`}>
          <div>
            <ShowMoreText
              lines={3}
              more={format('text.showMore')}
              less={format('text.showLess')}
              anchorClass="show-more"
              expanded={expanded}
            >
              {cell.render('Cell')}
            </ShowMoreText>
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

