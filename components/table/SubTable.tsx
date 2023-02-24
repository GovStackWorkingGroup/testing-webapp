import React from 'react';
import { ProductsType } from '../../service/types';
import SubTableHeader from './SubTableHeader';
import SubTableRow from './SubTableRow';

type Props = {
  product: ProductsType;
};

const SubTable = ({ product }: Props) => {
  return (
    <div className='sub-table'>
      <SubTableHeader />
      <SubTableRow compatibilities={product.compatibilities} />
    </div>
  );
};

export default SubTable;
