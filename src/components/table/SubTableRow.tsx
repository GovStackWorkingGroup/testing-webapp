import Link from 'next/link';
import { useCallback } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';
import { useIntl } from 'react-intl';
import { BuildingBlockType } from '../../service/types';
import BBImage from './BuildingBlocksImage';

type Props = {
  buildingBlock: BuildingBlockType;
  productName: string
};

const SubTableRow = ({ buildingBlock, productName }: Props) => {
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  return (
    <Link
      href={{ pathname: `/${productName}/${(buildingBlock.buildingBlock)}/${buildingBlock.id}` }}
      className='sub-table-link'>
      <div className='sub-table-row'>
        <div></div>
        <div className='sub-table-row-bb' data-testid='bb-name'>
          <BBImage imagePath={buildingBlock.buildingBlock} />
          <p>{format(buildingBlock.buildingBlock)}</p>
        </div>
        <div className='sub-table-content-tests'>
          <div data-testid='tests-passed'>
            <p>{buildingBlock.testsPassed}</p>
          </div>
          <div data-testid='tests-failed'>
            <p>{buildingBlock.testsFailed}</p>
          </div>
        </div>
        <div
          className='sub-table-content-compatibility'
          data-testid='compatibility'
        >
          <p>{`${Math.floor(buildingBlock.compatibility * 100)}%`}</p>
        </div>
        <div className='test-details-arrow'>
          <RiArrowRightSLine />
        </div>
      </div>
    </Link>
  );
};

export default SubTableRow;
