import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';

const ProductTableHeader = () => {
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  return (
    <div className='product-table-header'>
      <div></div>
      <div>
        <p>{format('product_name.label')}</p>
      </div>
      <div>
        <p>{format('building_block.plural.label')}</p>
      </div>
      <div>
        <p>{format('table.last_update.label')}</p>
      </div>
      <div>
        <p>{format('table.overall_compatibility.label')}</p>
      </div>
      <div></div>
    </div>
  );
};

export default ProductTableHeader;
