import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useTranslations from '../../hooks/useTranslation';
import { getComplianceList } from '../../service/serviceAPI';
import { CellValue, DataType, SingleComplianceItem } from '../../service/types';
import Table from '../table/Table';
import InfoModal from '../shared/modals/InfoModal';
import Button from '../shared/buttons/Button';
import { COMPLIANCE_TESTING_FORM } from '../../service/constants';
import InfiniteScrollCustomLoader from '../InfiniteScrollLoader';
import EvaluationSchemaTable from './EvaluationSchemaTable';

const ListOfCandidateResults = () => {
  const [resultData, setResultData] = useState<DataType>({ rows: [] });
  const [currentDataLength, setCurrentDataLength] = useState(0);
  const [allDataLength, setAllDataLength] = useState(0);
  const [displayEvaluationSchemaModal, setDisplayEvaluationSchemaModal] =
    useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const { format } = useTranslations();

  const headers = [
    'table.software_name.label',
    'table.bb_specification.label',
    'table.bb_version.label',
    'test_table.status.label',
    'table.submission_date.label',
    'table.deployment_compliance.label',
    'table.requirement_specification_compliance.label',
    'table.interface_compliance.label',
  ];

  useEffect(() => {
    fetchData(0, 5);
  }, []);

  const fetchData = async (offset: number, limit: number) => {
    setIsLoadingData(true);
    const fetchedData = await getComplianceList(offset, limit);
    if (fetchedData.status) {
      setAllDataLength(fetchedData.data.count);
      const transformedData: DataType = {
        rows: [...resultData.rows],
      };

      const propertyOrder: Array<keyof Omit<SingleComplianceItem, '_id'>> = [
        'softwareVersion',
        'bb',
        'bbVersion',
        'status',
        'submissionDate',
        'deploymentCompliance',
        'requirementSpecificationCompliance',
        'interfaceCompliance',
      ];

      for (const key in fetchedData.data.data) {
        if (Object.prototype.hasOwnProperty.call(fetchedData.data.data, key)) {
          let subHeaderAdded = false;
          transformedData.rows.push(
            ...fetchedData.data.data[key].map(
              (item: SingleComplianceItem, index: number) => {
                const cell: CellValue[] = [];
                for (const property of propertyOrder) {
                  if (Object.prototype.hasOwnProperty.call(item, property)) {
                    if (property === 'status') {
                      switch (item[property]) {
                      case 0:
                        cell.push({ value: format('table.draft.label') });
                        break;
                      case 1:
                        cell.push({ value: format('table.in_review.label') });
                        break;
                      case 2:
                        cell.push({ value: format('table.approved.label') });
                        break;
                      case 3:
                        cell.push({ value: format('table.rejected.label') });
                        break;
                      }
                    } else if (property === 'deploymentCompliance') {
                      cell.push({ value: item[property].level });
                    } else {
                      cell.push({ value: item[property] });
                    }
                  }
                }

                if (!subHeaderAdded && index === 0) {
                  subHeaderAdded = true;

                  return { cell, subHeader: key };
                } else {
                  return { cell };
                }
              }
            )
          );
        }
      }

      setCurrentDataLength(
        transformedData.rows.filter((row) => row.subHeader).length
      );
      setIsLoadingData(false);
      setResultData(transformedData);
    }
  };

  const handleLoadMoreData = () => {
    fetchData(currentDataLength, 5);
  };

  return (
    <>
      <div className="filters-and-button-container">
        <Button
          text={format('app.check_compliance.label')}
          styles="primary-button"
          type="link"
          href={COMPLIANCE_TESTING_FORM}
        />
      </div>
      <InfiniteScroll
        scrollableTarget="scrollableDiv"
        dataLength={currentDataLength}
        next={handleLoadMoreData}
        hasMore={allDataLength > currentDataLength}
        loader={<></>}
        style={{ overflowX: 'hidden' }}
      >
        <div className="list-of-candidate-table-container">
          <Table
            headers={headers}
            data={resultData}
            hasVerticalBorders={false}
            handleOpenEvaluationSchemaModal={(value) =>
              setDisplayEvaluationSchemaModal(value)
            }
            isScrollX={true}
            expandingRows={true}
          />
          {isLoadingData && <InfiniteScrollCustomLoader />}
        </div>
      </InfiniteScroll>
      {displayEvaluationSchemaModal && (
        <InfoModal
          onClose={() => setDisplayEvaluationSchemaModal(false)}
          modalTitle={format('app.evaluation_schema.label')}
        >
          <EvaluationSchemaTable />
        </InfoModal>
      )}
    </>
  );
};

export default ListOfCandidateResults;
