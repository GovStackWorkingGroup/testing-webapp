import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import { ProductsType } from '../../service/types';
import BBImage from './BuildingBlocksImage';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import SubTable from './SubTable';

type Props = {
  product: ProductsType;
};

const ProductTableRow = ({ product }: Props) => {
  const bbContentContainer = React.useRef<HTMLDivElement | null>(null);
  const [numberOfHidenBBImages, setNumberOfHidenBBImages] = useState<Number | null>(null);
  const [imageSectionWidth, setImageSectionWidth] = useState<string | undefined>();
  const [productLastUpdate, setProductLastUpdate] = useState<string>('');
  const [isSubTableOpen, setSubTableOpen] = useState<boolean>(false);

  const router = useRouter();
  const { locale } = router;

  const productCompatibilitiesLength = product.compatibilities.length;

  const getContainerSize = useCallback(() => {
    const bbContainer = bbContentContainer.current;
    if (productCompatibilitiesLength > 0 && bbContainer) {
      const bbImageWidth = bbContainer.clientWidth * 0.75;
      const numberOfVisibleBBImageinContainer =
        productCompatibilitiesLength - Math.floor((bbImageWidth || 0) / 28);

      setNumberOfHidenBBImages(Math.max(0, numberOfVisibleBBImageinContainer));
      setImageSectionWidth(`${bbImageWidth - (bbImageWidth % 28)}px`);
    }
  }, [productCompatibilitiesLength, bbContentContainer]);

  useEffect(getContainerSize, [getContainerSize]);

  useEffect(
    () => window.addEventListener('resize', debounce(getContainerSize, 20)),
    [getContainerSize]
  );

  useEffect(() => {
    const sortedTimeStamp = product.compatibilities.map((bb) => bb.timestamp).sort().reverse()[0];
    if (sortedTimeStamp) {
      setProductLastUpdate(new Date(sortedTimeStamp).toLocaleDateString(locale));
    } else {
      setProductLastUpdate('');
    }
  }, [product.compatibilities, locale]);

  const handleShowSubTable = () => {
    setSubTableOpen(!isSubTableOpen);
  };

  return (
    <>
      <div className='product-table-row' onClick={handleShowSubTable}>
        <div className='details-arrow'>
          {isSubTableOpen ? (
            <RiArrowUpSLine />
          ) : (
            <RiArrowDownSLine />
          )}
        </div>
        <div>
          <p>{product._id.testApp}</p>
        </div>
        <div className='table-bb-section'>
          <div ref={bbContentContainer}>
            <div className='table-bb-image' style={{ width: imageSectionWidth ?? '75%' }} >
              {product.compatibilities.map((bb, bbIdx) => (
                <BBImage
                  imagePath={bb.buildingBlock}
                  key={`bb-image-${bbIdx}`}
                />
              ))}
            </div>
            <div>
              {numberOfHidenBBImages ? (
                <div className='overflow-count' data-testid='bb-rest-count'>
                  <p>{`+${numberOfHidenBBImages}`}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div data-testid='product-last-update'>
          <p className='product-last-update'>{productLastUpdate}</p>
        </div>
        <div>
          <p></p>
        </div>
      </div>
      {isSubTableOpen && <SubTable product={product} />}
    </>
  );
};

export default ProductTableRow;
