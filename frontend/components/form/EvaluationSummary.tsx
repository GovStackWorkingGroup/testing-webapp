import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SoftwareAttributes, {
  SoftwareAttributesType,
} from '../compliance/SoftwareAttributes';
import { BBDetailsType, DataRow } from '../../service/types';
import useTranslations from '../../hooks/useTranslation';
import SoftwareDetails from '../compliance/SoftwareDetails';
import useGetDraftData from '../../hooks/useGetDraftDetail';
import Table from '../table/Table';

const EvaluationSummary = () => {
  const [softwareDetail, setSoftwareDetail] = useState<SoftwareAttributesType>([
    {
      logo: '',
      website: '',
      documentation: '',
      softwareName: '',
    },
  ]);

  const { format } = useTranslations();
  const router = useRouter();

  const { draftUUID } = router.query;

  const { draftData } = useGetDraftData({
    draftUUID: draftUUID as string,
  });

  const headers = [
    'evaluation_schema.compliance.label',
    'building_block.label',
  ];

  useEffect(() => {
    if (draftData) {
      setSoftwareDetail([
        {
          logo: draftData.logo,
          website: draftData.website,
          documentation: draftData.documentation,

          softwareName: draftData.softwareName,
        },
      ]);
    }
  }, [draftData]);

  const getObjectKeysWithNonEmptyInterfaceCompliance = (
    bbDetails: BBDetailsType | undefined | null
  ) => {
    const keysWithNonEmptyInterfaceCompliance = [];

    for (const key in bbDetails) {
      if (
        Object.prototype.hasOwnProperty.call(bbDetails, key) &&
        bbDetails[key].interfaceCompliance &&
        Object.keys(bbDetails[key].interfaceCompliance).length > 0
      ) {
        keysWithNonEmptyInterfaceCompliance.push(key);
      }
    }

    return keysWithNonEmptyInterfaceCompliance.length > 0
      ? keysWithNonEmptyInterfaceCompliance
      : ['-'];
  };

  const getObjectKeysWithNonEmptyRequirementSpec = (
    bbDetails: BBDetailsType | undefined | null
  ) => {
    const keysWithNonEmptyInterfaceCompliance = [];

    for (const key in bbDetails) {
      if (
        Object.prototype.hasOwnProperty.call(bbDetails, key) &&
        bbDetails[key].requirementSpecificationCompliance &&
        Object.keys(bbDetails[key].requirementSpecificationCompliance).length >
          0
      ) {
        keysWithNonEmptyInterfaceCompliance.push(key);
      }
    }

    return keysWithNonEmptyInterfaceCompliance;
  };

  const rows: DataRow[] = [
    {
      cell: [
        { value: format('table.deployment.label') },
        {
          values: [
            {
              values: [{ value: '-' }],
            },
          ],
        },
      ],
    },
    {
      cell: [
        { value: format('table.interface.label') },
        {
          values: [
            {
              values: getObjectKeysWithNonEmptyInterfaceCompliance(
                draftData?.formDetails[0].bbDetails
              ).map((bb) => {
                return { value: bb };
              }),
            },
          ],
        },
      ],
    },
    {
      cell: [
        { value: format('table.requirement_specification.label') },
        {
          values: [
            {
              values: getObjectKeysWithNonEmptyRequirementSpec(
                draftData?.formDetails[0].bbDetails
              ).map((bb) => {
                return { value: bb };
              }),
            },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      <div className="form-step-title">
        {format('form.evaluation_summary_title.label')}
      </div>
      <SoftwareDetails
        title={format('app.software_attributes.label')}
        editButton={true}
        redirectToStep={1}
        customStyles="software-detail-evaluation-summary"
      >
        <SoftwareAttributes softwareDetails={softwareDetail} />
      </SoftwareDetails>
      <SoftwareDetails
        title={format('form.filled_compliance_form.label')}
        editButton={true}
        redirectToStep={3}
        customStyles="software-detail-evaluation-summary"
      >
        <Table
          data={{ rows }}
          headers={headers}
          evaluationSummaryTable={true}
        ></Table>
      </SoftwareDetails>
    </div>
  );
};

export default EvaluationSummary;
