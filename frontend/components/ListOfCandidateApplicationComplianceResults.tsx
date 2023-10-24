import useTranslations from '../hooks/useTranslation';
import Table from './table/Table';

const ListOfCandidateApplicationComplianceResults = () => {
  const { format } = useTranslations();

  const data = {
    headers: [
      format('evaluation_schema.compliance.label'),
      format('evaluation_schema.requirement.label'),
      format('evaluation_schema.level_1.label'),
      'Interface Compliance',
    ],
    rows: [
      {
        subHeader: 'test1',
        cell: [
          {
            value: format('evaluation_schema.deployment_compliance.label'),
          },
          {
            value: format(
              'evaluation_schema.deployability_via_container.label'
            ),
          },
          { value: 'checked' },
          { value: 'checked' },
        ],
      },
      {
        subHeader: 'test2',
        cell: [
          {
            value: format('evaluation_schema.interface_compliance.label'),
          },
          {
            value: format('evaluation_schema.fulfillment_of_service_api.label'),
          },
          {
            value: format('evaluation_schema.equal_or_more_than_1.label'),
          },
          {
            value: format('evaluation_schema.all.label'),
          },
        ],
      },
      {
        subHeader: 'test3',
        cell: [
          {
            value: format('evaluation_schema.deployment_compliance.label'),
          },
          {
            // values: [
            //   {
            value: format(
              'evaluation_schema.fulfillment_of_required_key.label'
            ),
            //   },
            //   {
            //     value: format(
            //       'evaluation_schema.fulfillment_of_required_functional_requirements.label'
            //     ),
            //   },
            //   {
            //     value: format(
            //       'evaluation_schema.fulfillment_of_required_cross_cutting_requirements.label'
            //     ),
            //   },
            // ],
          },
          {
            // values: [
            //   {
            value: format('evaluation_schema.all.label'),
            // },
            //   {
            //     value: format('evaluation_schema.equal_or_more_than_1.label'),
            //   },
            //   { value: format('evaluation_schema.equal_or_more_than_1.label') },
            // ],
          },
          {
            // values: [
            //   {
            value: format('evaluation_schema.all.label'),
            //   },
            //   {
            //     value: format('evaluation_schema.all.label'),
            //   },
            //   {
            //     value: format('evaluation_schema.all.label'),
            //   },
            // ],
          },
        ],
      },
    ],
  };

  const handleRedirectToComplianceForm = (value: string | undefined) => {
    console.log('ss', value);
  };

  return (
    <Table
      data={data}
      hasVerticalBorders={false}
      handleRedirect={handleRedirectToComplianceForm}
    />
  );
};

export default ListOfCandidateApplicationComplianceResults;
