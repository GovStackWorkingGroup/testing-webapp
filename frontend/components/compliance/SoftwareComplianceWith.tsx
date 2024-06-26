import { useEffect, useState } from 'react';
import { Compliance, DataRow, DataType } from '../../service/types';
import Table from '../table/Table';
import InfoModal from '../shared/modals/InfoModal';
import useTranslations from '../../hooks/useTranslation';
import EvaluationSchemaTable from './EvaluationSchemaTable';

type SoftwareComplianceWithProps = {
  softwareComplianceData: Compliance[];
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

    const row: DataRow[] = softwareComplianceData.map((bbDetail) => ({
      cell: [
        { value: bbDetail.bbName },
        {
          values: bbDetail.bbVersions
            .slice()
            .sort((a, b) => {
              return b.bbVersion.localeCompare(a.bbVersion);
            })
            .map((bbVersion) => ({
              value: bbVersion.bbVersion ?? '',
            })),
        },
        {
          values: bbDetail.bbVersions.map(() => ({
            values: [
              { value: format('table.deployment_compliance.label') },
              { value: format('table.requirement_specification.label') },
              { value: format('table.interface_compliance.label') },
            ],
          })),
        },
        {
          values: bbDetail.bbVersions
            .slice()
            .sort((a, b) => {
              return b.bbVersion.localeCompare(a.bbVersion);
            })
            .map((bbVersion) => ({
              values: [
                { value: bbVersion.deploymentCompliance.level ?? '' },
                { value: bbVersion.requirements.level ?? '' },
                { value: bbVersion.interface.level ?? '' },
              ],
            })),
        },
        {
          values: bbDetail.bbVersions
            .slice()
            .sort((a, b) => {
              return b.bbVersion.localeCompare(a.bbVersion);
            })
            .map((bbVersion) => ({
              values: [
                { value: bbVersion.deploymentCompliance.notes ?? '' },
                { value: bbVersion.requirements.notes ?? '' },
                { value: bbVersion.interface.notes ?? '' },
              ],
            })),
        },
      ],
    }));

    row.forEach((row) => {
      transformedData.rows.push(row);
    });

    setSoftwareComplianceParams(transformedData);
  }, [softwareComplianceData, format]);

  return (
    <>
      <div className="software-compliance-with-table-container">
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
