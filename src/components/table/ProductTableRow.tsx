import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { useIntl } from 'react-intl';
import { ProductsType } from '../../service/types';
import TextTooltip from '../TextTooltip';
import BBImage from './BuildingBlocksImage';
import SubTable from './SubTable';

type Props = {
  product: ProductsType;
};

const ProductTableRow = ({ product }: Props) => {
  const bbContentContainer = React.useRef<HTMLDivElement | null>(null);
  const [numberOfHidenBBImages, setNumberOfHidenBBImages] = useState<number>(0);
  const [imageSectionWidth, setImageSectionWidth] = useState<string | undefined>();
  const [isSubTableOpen, setSubTableOpen] = useState<boolean>(false);

  const router = useRouter();
  const { locale } = router;

  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  const productCompatibilitiesLength = product.compatibilities.length;

  const getContainerSize = useCallback(() => {
    const bbContainer = bbContentContainer.current;
    const bbImageWidth = 28;
    if (productCompatibilitiesLength > 0 && bbContainer) {
      const bbImageContainerWidth = bbContainer.clientWidth * 0.75;
      const numberOfVisibleBBImageinContainer =
        productCompatibilitiesLength - Math.floor((bbImageContainerWidth || 0) / bbImageWidth);

      setNumberOfHidenBBImages(Math.max(0, numberOfVisibleBBImageinContainer));
      setImageSectionWidth(`${bbImageContainerWidth - (bbImageContainerWidth % bbImageWidth)}px`);
    }
  }, [productCompatibilitiesLength, bbContentContainer]);

  useEffect(getContainerSize, [getContainerSize]);

  useEffect(
    () => window.addEventListener('resize', debounce(getContainerSize, 20)),
    [getContainerSize]
  );

  useEffect(() => {
    const debouncedResize = debounce(getContainerSize, 30);
    window.addEventListener('resize', debouncedResize);

    return () => window.removeEventListener('resize', debouncedResize);
  }, [getContainerSize]);

  const bbTooltips = useMemo(() => {
    return product.compatibilities.map(bb => format(bb.buildingBlock));
  }, [product.compatibilities, format]);

  const handleShowSubTable = () => {
    setSubTableOpen(!isSubTableOpen);
  };

  const listOfHiddenBBImages = useMemo(() => {
    if (!product) {
      return null;
    }

    return product.compatibilities
      .slice((product.compatibilities.length - numberOfHidenBBImages))
      .map((bb) => bb.buildingBlock);
  }, [numberOfHidenBBImages, product]);

  return (
    <>
      <div
        className={classNames('product-table-row', { 'product-table-row-opened': isSubTableOpen })}
        data-testid={`product-table-row-${product._id.testApp}`}
        onClick={handleShowSubTable}
      >
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
                <div
                  className="imageWrapper"
                  data-tooltip-id='text-tooltip'
                  data-tooltip-offset={1}
                  data-tooltip-content={bbTooltips[bbIdx]}
                  key={`bb-image-${bbIdx}`}
                >
                  <BBImage imagePath={bb.buildingBlock} />
                  <TextTooltip customStyle='bb-icon-tooltip'/>
                </div>
              ))}
            </div>
            <div>
              {numberOfHidenBBImages ? (
                <div
                  className='overflow-count'
                  data-testid='bb-rest-count'
                  data-tooltip-id='text-tooltip'
                  data-tooltip-content={listOfHiddenBBImages?.map((bb) => format(bb)).join(', ')}
                >
                  <p>{`+${numberOfHidenBBImages}`}</p>
                  <TextTooltip customStyle='bb-icon-tooltip'/>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div data-testid='product-last-update'>
          <p className='product-last-update'>
            {product.lastUpdate ? new Date(product.lastUpdate).toLocaleDateString(locale) : ''}
          </p>
        </div>
        <div data-testid='product-overall-compatibility'>
          <p>{`${Math.floor(product.overallCompatibility*100)}%`}</p>
        </div>
      </div>
      {isSubTableOpen && <SubTable product={product} />}
    </>
  );
};

export default ProductTableRow;
