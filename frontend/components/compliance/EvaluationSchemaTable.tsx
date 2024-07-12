import useTranslations from '../../hooks/useTranslation';
import { DataType } from '../../service/types';
import Table from '../table/Table';

const EvaluationSchemaTable = () => {
  const { format } = useTranslations();

  const headers = [
    'evaluation_schema.compliance.label',
    'evaluation_schema.requirement.label',
    'evaluation_schema.level_1.label',
    'evaluation_schema.level_2.label',
  ];

  const data: DataType = {
    rows: [
      {
        cell: [
          {
            value: format('table.deployment_compliance.label'),
          },
          {
            value: format(
              'evaluation_schema.deployability_via_container.label'
            ),
          },
          { value: format('table.deployable.label') },
          { value: format('table.N/A.label') },
        ],
      },
      {
        cell: [
          {
            value: format('table.requirement_specification.label'),
          },
          {
            values: [
              {
                value: format(
                  'evaluation_schema.fulfillment_of_required_cc.label'
                ),
              },
              {
                value: format(
                  'evaluation_schema.fulfillment_of_required_functional_requirements.label'
                ),
              },
            ],
          },
          {
            values: [
              {
                value: format('evaluation_schema.over50.label'),
              },
              {
                value: format('evaluation_schema.over90.label'),
              },
            ],
          },
          {
            values: [
              {
                value: format('evaluation_schema.over50.label'),
              },
              {
                value: format('evaluation_schema.over90.label'),
              },
            ],
          },
        ],
      },
      {
        cell: [
          {
            value: format('table.interface_compliance.label'),
          },
          {
            values: [
              {
                value: format(
                  'evaluation_schema.fulfillment_of_service_api.label'
                ),
              },
              {
                value: format(
                  'evaluation_schema.fulfillment_of_required_api.label'
                ),
              },
            ],
          },
          {
            values: [
              {
                value: format('evaluation_schema.equal_or_more_than_1.label'),
              },
              {
                value: format('evaluation_schema.optional.label'),
              },
            ],
          },
          {
            values: [
              {
                value: format('evaluation_schema.all.label'),
              },
              {
                value: format('evaluation_schema.all.label'),
              },
            ],
          },
        ],
      },
    ],
  };

  return <Table data={data} headers={headers} isEvaluationSchema={true} />;
};

export default EvaluationSchemaTable;
