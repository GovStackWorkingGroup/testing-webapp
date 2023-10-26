import { useEffect, useState } from 'react';
import useTranslations from '../hooks/useTranslation';
import { getComplianceList } from '../service/serviceAPI';
import { CellValue, DataRow } from '../service/types';
import Table from './table/Table';

type DataProps = {
  headers: string[];
  rows: DataRow[] | Record<string, never>;
};

const ListOfCandidateApplicationComplianceResults = () => {
  const [data, setData] = useState({});
  const { format } = useTranslations();
  const fetchData = async () => {
    const [data] = await Promise.all([getComplianceList()]);
    if (data.status) {
      const transformedData: DataProps = {
        headers: [
          format('table.software_name.label'),
          format('table.bb_specification.label'),
          format('table.bb_version.label'),
          format('test_table.status.label'),
          format('table.submission_date.label'),
          format('table.deployment_compliance.label'),
          format('table.requirement_specification_compliance.label'),
          format('table.interface_compliance.label'),
        ],
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

      const originalData = {
        SandboxApp: [
          {
            _id: '653921814314d3101cbee82b',
            bb: 'bb digital registries',
            bbVersion: '1.2.0',
            status: 'In Review',
            deploymentCompliance: true,
            interfaceCompliance: 2,
            requirementSpecificationCompliance: 1,
            softwareVersion: '2.0',
            submissionDate: '2025-10-01T14:48:00.000Z',
          },
          {
            _id: '653921814314d3101cbee82b',
            bb: 'bb payments',
            bbVersion: '1.1.2',
            status: 'In Review',
            deploymentCompliance: true,
            interfaceCompliance: -1,
            softwareVersion: '2.0',
            submissionDate: '2022-11-01T14:48:00.000Z',
            requirementSpecificationCompliance: 1,
          },
        ],
        openIMIS: [
          {
            _id: '653921814314d3101cbee82a',
            bb: 'bb digital registries',
            bbVersion: '1.2.0',
            deploymentCompliance: true,
            interfaceCompliance: 2,
            status: 'In Review',
            requirementSpecificationCompliance: 1,
            softwareVersion: '2.0',
            submissionDate: '2025-10-01T14:48:00.000Z',
          },
        ],
      };

      /*eslint no-prototype-builtins: */
      for (const key in originalData) {
        if (originalData.hasOwnProperty(key)) {
          let subHeaderAdded = false;
          transformedData.rows.push(
            ...originalData[key].map((item: any, index: any) => {
              const cell: CellValue[] = [];
              for (const property of propertyOrder) {
                if (item.hasOwnProperty(property)) {
                  cell.push({ value: item[property] });
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
    fetchData();
  }, []);

  return <Table data={data} hasVerticalBorders={false} />;
};

export default ListOfCandidateApplicationComplianceResults;
