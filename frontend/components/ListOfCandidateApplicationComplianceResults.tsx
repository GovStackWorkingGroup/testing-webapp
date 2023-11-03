import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useTranslations from '../hooks/useTranslation';
import { getComplianceList } from '../service/serviceAPI';
import { CellValue, DataProps } from '../service/types';
import Table from './table/Table';
import InfoModal from './shared/modals/InfoModal';
import EvaluationSchemaTable from './table/EvaluationSchemaTable';
import Button from './shared/buttons/Button';
import { COMPLIANCE_TESTING_FORM } from './constants';
import InfiniteScrollCustomLoader from './InfiniteScrollLoader';

const ListOfCandidateApplicationComplianceResults = () => {
  const [data, setData] = useState({});
  const [displayEvaluationSchemaModal, setDisplayEvaluationSchemaModal] =
    useState(false);

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

  const fetchData = async (offset: number, limit: number) => {
    const [data] = await Promise.all([getComplianceList(offset, limit)]);
    if (data.status) {
      const transformedData: DataProps = {
        rows: [],
      };

      const propertyOrder = [
        'softwareVersion',
        'bb',
        'bbVersion',
        'status',
        'submissionDate',
        'deploymentCompliance',
        'requirementSpecificationCompliance',
        'interfaceCompliance',
      ];

      /*eslint no-prototype-builtins: */
      for (const key in data.data) {
        if (data.data.hasOwnProperty(key)) {
          let subHeaderAdded = false;
          transformedData.rows.push(
            // @ts-ignore
            ...data.data[key].map((item: object, index: number) => {
              const cell: CellValue[] = [];
              for (const property of propertyOrder) {
                if (item.hasOwnProperty(property)) {
                  if (property === 'status') {
                    // @ts-ignore
                    switch (item[property]) {
                    case 0:
                      cell.push({ value: 'Draft' });
                      break;
                    case 1:
                      cell.push({ value: 'In Review' });
                      break;
                    case 2:
                      cell.push({ value: 'Approved' });
                      break;
                    case 3:
                      cell.push({ value: 'Rejected' });
                      break;
                    }
                  } else {
                    // @ts-ignore
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
            })
          );
        }
      }

      setData(transformedData);
    }
  };

  useEffect(() => {
    fetchData(0, 10);
  }, []);

  const handleLoadMoreData = () => {
    // Call fetchData
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
        dataLength={Object.keys(data).length}
        next={handleLoadMoreData}
        hasMore={false}
        loader={<InfiniteScrollCustomLoader />}
        style={{ overflowX: 'hidden' }}
      >
        <div className="list-of-candidate-table-container">
          <Table
            headers={headers}
            data={data}
            hasVerticalBorders={false}
            handleOpenEvaluationSchemaModal={(value) =>
              setDisplayEvaluationSchemaModal(value)
            }
          />
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

export default ListOfCandidateApplicationComplianceResults;
