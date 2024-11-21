import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { RiCheckboxCircleFill, RiErrorWarningFill } from 'react-icons/ri';
import {
  COMPLIANCE_TESTING_RESULT_PAGE,
  StatusEnum,
} from '../../../../service/constants';
import BackToPageButton from '../../../../components/shared/buttons/BackToPageButton';
import {
  getSoftwareDetails,
  getSoftwareDetailsReport,
  handleReviewSoftwareForm,
} from '../../../../service/serviceAPI';
import SoftwareDetails from '../../../../components/compliance/SoftwareDetails';
import SoftwareComplianceWith from '../../../../components/compliance/SoftwareComplianceWith';
import {
  FormUpdatedObject,
  SoftwareDetailsDataType,
  SoftwareDetailsType,
  SoftwareDetailsTypeCompliance,
} from '../../../../service/types';
import SoftwareAttributes from '../../../../components/compliance/SoftwareAttributes';
import useTranslations from '../../../../hooks/useTranslation';
import ComplianceDetailTable, {
  ComplianceDetailFormValuesType,
} from '../../../../components/table/ComplianceDetailTable';
import InfoModal from '../../../../components/shared/modals/InfoModal';
import EvaluationSchemaTable from '../../../../components/compliance/EvaluationSchemaTable';

const SoftwareComplianceDetailsPage = () => {
  const [softwareDetail, setSoftwareDetail] = useState<
    SoftwareDetailsType | []
  >([]);

  const [softwareDetailsDataToApprove, setSoftwareDetailsDataToApprove] =
    useState<SoftwareDetailsDataType[]>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedFormState, setSavedFormState] = useState({});
  const [displayEvaluationSchemaModal, setDisplayEvaluationSchemaModal] =
    useState(false);

  const { format } = useTranslations();
  const router = useRouter();
  const { softwareName } = router.query;

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    fetchData(softwareName as string);
  }, [softwareName]);

  useEffect(() => {
    if (softwareDetail.length) {
      fetchSoftwareDetailsData(softwareDetail[0].compliance);
    }
  }, [softwareDetail]);

  const fetchData = async (softwareName: string) => {
    const data = await getSoftwareDetails(softwareName);
    if (data.status) {
      setSoftwareDetail(data.data);
    }
  };

  const formatSoftwareDetailsDataToApprove = (
    data: SoftwareDetailsDataType[] = [],
    id: string | undefined
  ) => {
    return data.filter((item) => item.formDetails[0].id === id)[0];
  };

  const fetchSoftwareDetailsData = async (
    complianceArray: SoftwareDetailsTypeCompliance[]
  ) => {
    try {
      const fetchComplianceFormsData = complianceArray.map((form) =>
        getSoftwareDetailsReport(form.id || '')
      );

      const responses = await Promise.all(fetchComplianceFormsData);

      if (responses.some((item) => !item.status)) {
        throw new Error('Error fetching compliance forms data');
      }

      const softwareDetailsData = responses.map((response) => {
        if ('data' in response) {
          return response.data;
        } else {
          throw new Error('Response does not contain data');
        }
      });

      setSoftwareDetailsDataToApprove(softwareDetailsData);
    } catch (error) {
      throw new Error(`[fetchSoftwareDetailsData]: ${error}`);
    }
  };

  const handleFormAction = async (
    updatedData: ComplianceDetailFormValuesType[],
    type: 'update' | 'accept' | 'reject'
  ) => {
    if (updatedData) {
      const payload: FormUpdatedObject = {
        bbDetails: {},
      };

      updatedData.forEach((item) => {
        const {
          bbName,
          interfaceCompliance,
          deploymentCompliance,
          requirementSpecificationCompliance,
        } = item;

        payload.bbDetails[bbName] = {
          interfaceCompliance: {
            level: interfaceCompliance.level,
            notes: interfaceCompliance.notes || '',
          },
          deploymentCompliance: {
            level: deploymentCompliance.level,
            notes: deploymentCompliance.notes || '',
          },
          requirementSpecificationCompliance: {
            level: requirementSpecificationCompliance.level,
            notes: requirementSpecificationCompliance.notes || '',
          },
        };
      });

      const complianceFormId = updatedData[0].id;

      await handleReviewSoftwareForm(complianceFormId, payload, type).then(
        (response) => {
          if (response.status) {
            if (type === 'accept') {
              toast.success(format('form.form_accepted_success.message'), {
                icon: <RiCheckboxCircleFill className='success-toast-icon' />,
              });
              router.push(COMPLIANCE_TESTING_RESULT_PAGE);

              return;
            }

            if (type === 'update') {
              toast.success(format('form.form_update_success.message'), {
                icon: <RiCheckboxCircleFill className='success-toast-icon' />,
              });
              setSavedFormState((prevState) => ({
                ...prevState,
                [complianceFormId]: true,
              }));

              return;
            }

            if (type === 'reject') {
              toast.success(format('form.form_reject_success.message'), {
                icon: <RiCheckboxCircleFill className='success-toast-icon' />,
              });
              router.push(COMPLIANCE_TESTING_RESULT_PAGE);

              return;
            }

            return;
          }

          if (!response.status) {
            if (type === 'accept') {
              toast.error(format('form.form_accepted_error.message'), {
                icon: <RiErrorWarningFill className='error-toast-icon' />,
              });

              return;
            }

            if (type === 'update') {
              toast.error(format('form.form_update_error.message'), {
                icon: <RiErrorWarningFill className='error-toast-icon' />,
              });

              return;
            }

            if (type === 'reject') {
              toast.error(format('form.form_reject_error.message'), {
                icon: <RiErrorWarningFill className='error-toast-icon' />,
              });

              return;
            }

            return;
          }
        }
      );
    }
  };

  const processSoftwareDetailsData = (softwareDetail: SoftwareDetailsType) => {
    const ungroupedCompliance = softwareDetail[0].compliance;

    const groupedCompliance = ungroupedCompliance.reduce(
      (acc, item) => {
        if (!acc[item.version]) {
          acc[item.version] = [item];
        } else {
          acc[item.version].push(item);
        }

        return acc;
      },
      {} as {
        [key: string]: SoftwareDetailsTypeCompliance[];
      }
    );

    const processedDetail = {
      ...softwareDetail[0],
      compliance: Object.entries(groupedCompliance).map(
        ([version, bbDetails]) => {
          return {
            softwareVersion: version,
            bbDetails,
          };
        }
      ),
    };

    return processedDetail;
  };

  return (
    <div>
      <div className='compliance-detail-page-container'>
        <BackToPageButton
          text={format('app.back_to_reports_list.label')}
          href={COMPLIANCE_TESTING_RESULT_PAGE}
        />
        <SoftwareDetails title={format('app.software_attributes.label')}>
          <SoftwareAttributes
            softwareDetails={softwareDetail}
            showContactDetails={true}
          />
        </SoftwareDetails>
        {softwareDetail.length && softwareDetail[0].compliance.length
          ? processSoftwareDetailsData(softwareDetail).compliance.map(
            (complianceItem, indexKey) => {
              return complianceItem.bbDetails.map((detailItem) => {
                return (
                  <SoftwareDetails
                    title={format('app.compliance_with.label')}
                    complianceSection={true}
                    softwareVersion={detailItem.version}
                    softwareId={detailItem.id}
                    key={`software-compliance-with-${indexKey}`}
                    viewReportDetails={true}
                  >
                    {isLoggedIn &&
                      softwareDetail.length &&
                      softwareDetail[0].status === StatusEnum.IN_REVIEW ? (
                        <>
                          <ComplianceDetailTable
                            key={`compliance-detail-table-${indexKey}`}
                            data={formatSoftwareDetailsDataToApprove(
                              softwareDetailsDataToApprove,
                              detailItem.id
                            )}
                            detailItem={detailItem}
                            handleOpenEvaluationSchemaModal={(value) =>
                              setDisplayEvaluationSchemaModal(value)
                            }
                            handleFormAction={handleFormAction}
                            savedFormState={savedFormState}
                          />
                        </>
                      ) : (
                        <SoftwareComplianceWith
                          key={`software-compliance-with-${indexKey}`}
                          softwareComplianceData={detailItem.bbDetailsArray}
                        />
                      )}
                  </SoftwareDetails>
                );
              });
            }
          )
          : null}
      </div>
      {displayEvaluationSchemaModal && (
        <InfoModal
          onClose={() => setDisplayEvaluationSchemaModal(false)}
          modalTitle={format('app.evaluation_schema.label')}
        >
          <EvaluationSchemaTable />
        </InfoModal>
      )}
    </div>
  );
};

export default SoftwareComplianceDetailsPage;
