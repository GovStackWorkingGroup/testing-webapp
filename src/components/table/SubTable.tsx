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
      {product.compatibilities.map((buildingBlock, bbIdx) => (
        <SubTableRow
          productName={product._id.testApp}
          buildingBlock={buildingBlock}
          key={`buildingBlock-${bbIdx}`}
        />
      ))}
    </div>
  );
};

export default SubTable;
