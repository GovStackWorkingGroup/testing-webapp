import { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useTranslations from '../../hooks/useTranslation';
import { getComplianceList } from '../../service/serviceAPI';
import { CellValue, DataType, SingleComplianceItem, ListFilters, ParentOfCandidatesResult } from '../../service/types';
import Table from '../table/Table';
import InfoModal from '../shared/modals/InfoModal';
import Button from '../shared/buttons/Button';
import { COMPLIANCE_TESTING_FORM } from '../../service/constants';
import InfiniteScrollCustomLoader from '../InfiniteScrollLoader';
import ListOfCandidateFilter from './ListOfCandidateResultFilter';
import EvaluationSchemaTable from './EvaluationSchemaTable';

const ListOfCandidateResults = () => {
  const [resultData, setResultData] = useState<DataType>({ rows: [] });
  const [currentDataLength, setCurrentDataLength] = useState(0);
  const [allDataLength, setAllDataLength] = useState(0);
  const [displayEvaluationSchemaModal, setDisplayEvaluationSchemaModal] =
    useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [softwareFilters, setSoftwareFilters] = useState({});
  const [bbFilters, setBbFilters] = useState({});
  const resetDataFlag = useRef(false);

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
    !isLoadingData && fetchData(0, 10, {
      software: softwareFilters,
      bb: bbFilters
    });
  }, []);

  useEffect(() => {
    setResultData({ rows: [] });
    setCurrentDataLength(0);
    setAllDataLength(0);
    resetDataFlag.current = true;
  }, [softwareFilters, bbFilters]);

  useEffect(() => {
    resetDataFlag.current && !isLoadingData && fetchData(0, 10, {
      software: softwareFilters,
      bb: bbFilters
    });
    resetDataFlag.current = false;
  }, [resetDataFlag.current]);

  const fetchData = async (offset: number, limit: number, filters: ListFilters) => {

    setIsLoadingData(true);
    const fetchedData = await getComplianceList(offset, limit, filters);
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
      const parents = Object.entries(fetchedData.data.data).map(([name, children]) => ({ name, children }));

      const getLatestSubmissionDate = (children: SingleComplianceItem[]) => {
        return children.reduce((latest, child) => {
          return new Date(child.submissionDate) > new Date(latest) ? child.submissionDate : latest;
        }, children[0].submissionDate);
      };

      parents.sort((a: ParentOfCandidatesResult, b: ParentOfCandidatesResult) => {
        const aLatestDate = getLatestSubmissionDate(a.children);
        const bLatestDate = getLatestSubmissionDate(b.children);

        return new Date(bLatestDate).getTime() - new Date(aLatestDate).getTime();
      });

      const transformedSortedData = parents.reduce((acc: any, parent) => {
        acc[parent.name] = parent.children;

        return acc;
      }, {});

      for (const key in transformedSortedData) {
        if (Object.prototype.hasOwnProperty.call(transformedSortedData, key)) {
          let subHeaderAdded = false;
          transformedData.rows.push(
            ...transformedSortedData[key].map(
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
                      cell.push({ value: item[property] ? item[property].level : '' });
                    } else {
                      cell.push({ value: item[property] });
                    }
                  }
                }

                if (!subHeaderAdded && index === 0) {
                  subHeaderAdded = true;

                  return { cell, subHeader: key, logo: item.logo };
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
    fetchData(currentDataLength, 10, {
      software: softwareFilters,
      bb: bbFilters
    });
  };

  return (
    <>
      <p className="filters-and-button-container definition-title" style={{ alignItems: 'left', padding: '10px' }}>
        {format('app.reports.title')}
      </p>
      <div className="filters-and-button-container">
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <ListOfCandidateFilter
            filterType='bb' onChange={(s) => setBbFilters(s)} placeholder={format('building_block.label')}/>
          <ListOfCandidateFilter
            filterType='software' onChange={(s) => setSoftwareFilters(s)} placeholder={format('software.label')}/>
        </span>
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
