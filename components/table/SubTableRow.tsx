import React from 'react';
import { CompatibilitiesType } from '../../service/types';
import BBImage from './BuildingBlocksImage';

type Props = {
  compatibilities: CompatibilitiesType[];
};

const SubTableRow = ({ compatibilities }: Props) => {
  return (
    <div>
      {compatibilities.map((bb) => {
        return (
          <div className='sub-table-row'>
            <div></div>
              <div className='sub-table-row-bb'>
                <BBImage imagePath={bb.buildingBlock} />
                <p>{bb.buildingBlock}</p>
              </div>
              <div className='sub-table-content-tests'>
                <div>
                  <p>{bb.testsPassed}</p>
                </div>
                <div>
                  <p>{bb.testsFailed}</p>
                </div>
              </div>
              <div className='sub-table-content-compatibility'>
                <p>{`${bb.compatibility*100}%`}</p>
              </div>
              <div className='test-details-arrow'></div>
          </div>
        );
      })}
    </div>
  );
};

export default SubTableRow;
