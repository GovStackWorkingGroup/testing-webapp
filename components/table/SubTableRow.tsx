import React from 'react';
import { CompatibilitiesType } from '../../service/types';
import BBImage from './BuildingBlocksImage';

type Props = {
  compatibilities: CompatibilitiesType[];
};

const SubTableRow = ({ compatibilities }: Props) => {
  return (
    <div>
      {compatibilities.map((bb, bbIdx) => {
        return (
          <div className='sub-table-row' key={`sub-table-row-${bbIdx}`}>
            <div></div>
            <div className='sub-table-row-bb' data-testid='bb-name'>
              <BBImage imagePath={bb.buildingBlock} />
              <p>{bb.buildingBlock}</p>
            </div>
            <div className='sub-table-content-tests'>
              <div data-testid='tests-passed'>
                <p>{bb.testsPassed}</p>
              </div>
              <div data-testid='tests-failed'>
                <p>{bb.testsFailed}</p>
              </div>
            </div>
            <div className='sub-table-content-compatibility' data-testid='compatibility'>
              <p>{`${(bb.compatibility*100).toFixed(2)}%`}</p>
            </div>
            <div className='test-details-arrow'></div>
          </div>
        );
      })}
    </div>
  );
};

export default SubTableRow;
