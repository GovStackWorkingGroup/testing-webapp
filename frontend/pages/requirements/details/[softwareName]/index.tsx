import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { RiCheckboxCircleFill, RiErrorWarningFill } from 'react-icons/ri';
import { COMPLIANCE_TESTING_RESULT_PAGE } from '../../../../service/constants';
import BackToPageButton from '../../../../components/shared/buttons/BackToPageButton';
import {
  getSoftwareDetails,
  getSoftwareDetailsReport,
  handleReviewSoftwareForm,
  handleDeleteSoftwareForm
} from '../../../../service/serviceAPI';
import SoftwareDetails from '../../../../components/compliance/SoftwareDetails';
import SoftwareComplianceWith from '../../../../components/compliance/SoftwareComplianceWith';
import {
  FormUpdatedObject,
  SoftwareDetailsDataType,
  SoftwareDetailsType,
} from '../../../../service/types';
import SoftwareAttributes from '../../../../components/compliance/SoftwareAttributes';
import useTranslations from '../../../../hooks/useTranslation';
import ComplianceDetailTable, {
  ComplianceDetailFormValuesType,
} from '../../../../components/table/ComplianceDetailTable';
import Button from '../../../../components/shared/buttons/Button';
import Input from '../../../../components/shared/inputs/Input';
import InfoModal from '../../../../components/shared/modals/InfoModal';
import EvaluationSchemaTable from '../../../../components/compliance/EvaluationSchemaTable';

const SoftwareComplianceDetailsPage = () => {
  const [softwareDetail, setSoftwareDetail] = useState<
    SoftwareDetailsType | []
  >([]);
  const [deleteSoftwareName, setDeleteSoftwareName] = useState<string>();

  const [softwareDetailsDataToApprove, setSoftwareDetailsDataToApprove] =
    useState<SoftwareDetailsDataType>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [updatedData, setUpdatedData] = useState<
    ComplianceDetailFormValuesType[] | undefined
  >();
  const [isFormSaved, setIsFormSaved] = useState(false);
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
      fetchSoftwareDetailsData(softwareDetail[0]._id);
    }
  }, [softwareDetail]);

  const fetchData = async (softwareName: string) => {
    if (softwareName) {
      const data = await getSoftwareDetails(softwareName);
      if (data.status) {
        setSoftwareDetail(data.data);
      }
    }
  };

  const fetchSoftwareDetailsData = async (id: string) => {
    const data = await getSoftwareDetailsReport(id);
    if (data.status) {
      setSoftwareDetailsDataToApprove(data.data);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    if (name === 'softwareName') {
      setDeleteSoftwareName(value);
    }
  };

  const handleDeleteEntry = async () => {
    if (deleteSoftwareName === softwareName) {
      await handleDeleteSoftwareForm(softwareDetail[0]._id).then(
        (response) => {
          if (response.status) {
            toast.success(format('form.form_deleted_success.message'), {
              icon: <RiCheckboxCircleFill className="success-toast-icon" />,
            });
            router.push(COMPLIANCE_TESTING_RESULT_PAGE);

            return;
          } else {
            toast.error(format('form.form_deleted_error.message'), {
              icon: <RiErrorWarningFill className="error-toast-icon" />,
            });

            return;
          }
        });
    }
  };

  const handleFormAction = async (type: 'update' | 'accept' | 'reject') => {
    if (updatedData) {
      const payload: FormUpdatedObject = {
        bbDetails: {},
      };

      updatedData.forEach((item) => {
        const {
          bbName,
          interface: interfaceData,
          deployment,
          requirement
        } = item;

        payload.bbDetails[bbName] = {
          interfaceCompliance: {
            level: interfaceData.level,
            notes: interfaceData.note || '',
          },
          deploymentCompliance: {
            level: deployment.level,
            notes: deployment.note || '',
          },
          requirementSpecificationCompliance: {
            level: requirement.level,
            notes: requirement.note || '',
          },
        };
      });

      await handleReviewSoftwareForm(softwareDetail[0]._id, payload, type).then(
        (response) => {
          if (response.status) {
            if (type === 'accept') {
              toast.success(format('form.form_accepted_success.message'), {
                icon: <RiCheckboxCircleFill className="success-toast-icon" />,
              });
              router.push(COMPLIANCE_TESTING_RESULT_PAGE);

              return;
            }

            if (type === 'update') {
              toast.success(format('form.form_update_success.message'), {
                icon: <RiCheckboxCircleFill className="success-toast-icon" />,
              });
              setIsFormSaved(true);

              return;
            }

            if (type === 'reject') {
              toast.success(format('form.form_reject_success.message'), {
                icon: <RiCheckboxCircleFill className="success-toast-icon" />,
              });
              router.push(COMPLIANCE_TESTING_RESULT_PAGE);

              return;
            }

            return;
          }

          if (!response.status) {
            if (type === 'accept') {
              toast.error(format('form.form_accepted_error.message'), {
                icon: <RiErrorWarningFill className="error-toast-icon" />,
              });

              return;
            }

            if (type === 'update') {
              toast.error(format('form.form_update_error.message'), {
                icon: <RiErrorWarningFill className="error-toast-icon" />,
              });

              return;
            }

            if (type === 'reject') {
              toast.error(format('form.form_reject_error.message'), {
                icon: <RiErrorWarningFill className="error-toast-icon" />,
              });

              return;
            }

            return;
          }
        }
      );
    }
  };

  return (
    <div>
      <div className="compliance-detail-page-container">
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
        {isLoggedIn && (
          <div className="software-attributes-section">
            <Input
              name="softwareName"
              isInvalid={false}
              inputTitle={format('form.software_delete.placeholder')}
              errorMessage={format('form.required_field.message')}
              onChange={(event) => handleInputChange(event)}
              inputKey="key-software-name"
            />
            <Button
              type="button"
              text={format('form.software_delete.label')}
              styles="primary-red-button"
              onClick={() => handleDeleteEntry()}
            />
          </div>
        )}
        {softwareDetail.length && softwareDetail[0].compliance.length
          ? softwareDetail[0].compliance.map((item, indexKey) => (
            <SoftwareDetails
              title={format('app.compliance_with.label')}
              complianceSection={true}
              softwareVersion={item.softwareVersion}
              softwareId={softwareDetail[0].compliance[indexKey]._id} // Pass the correct ID for each compliance item
              key={`software-compliance-with-${indexKey}`}
              viewReportDetails={true}
            >
              {isLoggedIn && softwareDetail.length && softwareDetail[0].status === 1 ? (
                <ComplianceDetailTable
                  data={softwareDetailsDataToApprove}
                  handleOpenEvaluationSchemaModal={(value) =>
                    setDisplayEvaluationSchemaModal(value)
                  }
                  setUpdatedData={(data) => {
                    setUpdatedData(data);
                    setIsFormSaved(false);
                  }}
                />
              ) : (
                <SoftwareComplianceWith
                  softwareComplianceData={item.bbDetails}
                />
              )}
            </SoftwareDetails>
          ))
          : null}

      </div>
      {(isLoggedIn && softwareDetail.length && softwareDetail[0].status === 1) &&
        <div className="bottom-bar-container">
          <div className="bottom-bar">
            <Button
              type="button"
              text={format('app.save.label')}
              styles="secondary-button"
              onClick={() => handleFormAction('update')}
              showCheckIcon={isFormSaved}
            />
            <Button
              type="button"
              text={format('form.reject.label')}
              styles="primary-red-button"
              onClick={() => handleFormAction('reject')}
            />
            <Button
              type="button"
              text={format('form.accept.label')}
              styles="primary-button"
              onClick={() => handleFormAction('accept')}
            />
          </div>
        </div>
      }
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
