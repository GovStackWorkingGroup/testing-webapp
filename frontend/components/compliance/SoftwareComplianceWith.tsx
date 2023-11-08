import { useEffect, useState } from 'react';
import { Compliance, DataRow, DataType } from '../../service/types';
import Table from '../table/Table';
import InfoModal from '../shared/modals/InfoModal';
import useTranslations from '../../hooks/useTranslation';
import EvaluationSchemaTable from './EvaluationSchemaTable';

type SoftwareComplianceWithProps = {
  softwareComplianceData: Compliance;
};

const SoftwareComplianceWith = ({
  softwareComplianceData,
}: SoftwareComplianceWithProps) => {
  const [softwareComplianceParams, setSoftwareComplianceParams] =
    useState<DataType>({ rows: [] });
  const [displayEvaluationSchemaModal, setDisplayEvaluationSchemaModal] =
    useState(false);

  const { format } = useTranslations();

  const headers = [
    'building_block.plural.label',
    'table.building_block_version.label',
    'table.compliance.label',
    'table.compliance_level.label',
    'table.notes',
  ];

  useEffect(() => {
    const transformedData: DataType = {
      rows: [],
    };

    for (const key in softwareComplianceData) {
      if (Object.prototype.hasOwnProperty.call(softwareComplianceData, key)) {
        const item = softwareComplianceData[key];
        const row: DataRow = {
          cell: [
            { value: key },
            { value: item.bbVersion },
            {
              values: [
                { value: 'Interface' },
                { value: 'Requirement Specification' },
              ],
            },
            {
              values: [
                { value: item.interfaceCompliance.level },
                { value: item.requirementSpecificationCompliance.level },
              ],
            },
            {
              values: [
                { value: item.interfaceCompliance.note ?? '' },
                { value: item.requirementSpecificationCompliance.note ?? '' },
              ],
            },
          ],
        };

        transformedData.rows.push(row);
      }
    }

    setSoftwareComplianceParams(transformedData);
  }, [softwareComplianceData]);

  return (
    <>
      <Table
        data={softwareComplianceParams}
        headers={headers}
        handleOpenEvaluationSchemaModal={(value) =>
          setDisplayEvaluationSchemaModal(value)
        }
      />
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

export default SoftwareComplianceWith;
