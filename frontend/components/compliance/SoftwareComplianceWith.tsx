import { useEffect, useState } from 'react';
import { ComplianceItem, DataType } from '../../service/types';
import Table from '../table/Table';
import InfoModal from '../shared/modals/InfoModal';
import useTranslations from '../../hooks/useTranslation';
import EvaluationSchemaTable from './EvaluationSchemaTable';

type SoftwareComplianceWithProps = {
  softwareComplianceData: ComplianceItem[];
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
      rows: softwareComplianceData.map((bbDetail) => ({
        cell: [
          // Building Block Name
          { value: bbDetail.bbName },
          // Building Block Version
          {
            values: [
              {
                value: bbDetail.bbVersion ?? '',
              },
            ],
          },
          // Compliance Labels
          {
            values: [
              {
                values: [
                  { value: format('table.deployment_compliance.label') },
                  { value: format('table.requirement_specification.label') },
                  { value: format('table.interface_compliance.label') },
                ],
              },
            ],
          },
          // Compliance Levels
          {
            values: [
              {
                values: [
                  { value: bbDetail.deploymentCompliance.level ?? '' },
                  { value: bbDetail.requirements.level ?? '' },
                  { value: bbDetail.interface.level ?? '' },
                ],
              },
            ],
          },
          // Compliance Notes
          {
            values: [
              {
                values: [
                  { value: bbDetail.deploymentCompliance.notes ?? '' },
                  { value: bbDetail.requirements.notes ?? '' },
                  { value: bbDetail.interface.notes ?? '' },
                ],
              },
            ],
          },
        ],
      })),
    };

    setSoftwareComplianceParams(transformedData);
  }, [softwareComplianceData, format]);

  return (
    <>
      <div className='software-compliance-with-table-container'>
        <Table
          data={softwareComplianceParams}
          headers={headers}
          handleOpenEvaluationSchemaModal={(value) =>
            setDisplayEvaluationSchemaModal(value)
          }
        />
      </div>
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
