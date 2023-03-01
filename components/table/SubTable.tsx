import React from 'react';
import { ProductsType } from '../../service/types';
import SubTableHeader from './SubTableHeader';
import SubTableRows from './SubTableRows';

type Props = {
  product: ProductsType;
};

const SubTable = ({ product }: Props) => {
  return (
    <div className='sub-table'>
      <SubTableHeader />
      <SubTableRows compatibilities={product.compatibilities} />
    </div>
  );
};

export default SubTable;
