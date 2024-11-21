import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { RiCheckboxCircleFill, RiErrorWarningFill } from 'react-icons/ri';
import useTranslations from '../../hooks/useTranslation';
import {
  COMPLIANCE_TESTING_DETAILS_PAGE,
  COMPLIANCE_TESTING_RESULT_PAGE,
} from '../../service/constants';
import Button from '../shared/buttons/Button';
import { formatTranslationType } from '../../service/types';
import ConfirmModal from '../shared/modals/ConfirmModal';
import { handleDeleteSoftwareForm } from '../../service/serviceAPI';

type SoftwareDetailsProps = {
  title: formatTranslationType;
  children: React.ReactNode;
  complianceSection?: boolean;
  softwareVersion?: string;
  softwareId?: string;
  customStyles?: string;
  editButton?: boolean;
  redirectToStep?: number;
  viewReportDetails?: boolean;
};

const SoftwareDetails = ({
  title,
  children,
  complianceSection = false,
  softwareVersion,
  softwareId,
  customStyles,
  editButton = false,
  redirectToStep,
  viewReportDetails,
}: SoftwareDetailsProps) => {
  const { format } = useTranslations();
  const router = useRouter();
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] =
    useState<boolean>(false);

  const { draftUUID, softwareName } = router.query;

  const handlePressEdit = () => {
    if (draftUUID) {
      router.replace({
        query: { draftUUID, formStep: redirectToStep },
      });
    }
  };

  const onEntryDelete = async () => {
    if (!softwareId) {
      return;
    }

    await handleDeleteSoftwareForm(softwareId).then((response) => {
      if (response.status) {
        toast.success(format('form.form_deleted_success.message'), {
          icon: <RiCheckboxCircleFill className='success-toast-icon' />,
        });
        setDeleteConfirmModalOpen(false);
        router.push(COMPLIANCE_TESTING_RESULT_PAGE);

        return;
      } else {
        toast.error(format('form.form_deleted_error.message'), {
          icon: <RiErrorWarningFill className='error-toast-icon' />,
        });
        setDeleteConfirmModalOpen(false);

        return;
      }
    });
  };

  return (
    <div
      className={`software-attributes-section ${
        customStyles ? customStyles : ''
      }`}
    >
      {complianceSection ? (
        <div className='software-attributes-title-with-link'>
          <p>
            {title}{' '}
            <span className='bold'>{`${format('table.software_name.label')} ${
              softwareVersion ? softwareVersion : format('app.not_available')
            }`}</span>
          </p>
          <div className='software-actions'>
            <Button
              type='button'
              onClick={() => setDeleteConfirmModalOpen(true)}
              text={format('form.software_delete.label')}
              styles='primary-red-button'
            />
            {viewReportDetails && (
              <Button
                type='link'
                href={`/${COMPLIANCE_TESTING_DETAILS_PAGE}${softwareName}/reportDetails/${softwareId}`}
                text={format('app.view_report_details.label')}
                styles='primary-button'
              />
            )}
          </div>
        </div>
      ) : (
        <div className='software-attributes-title-with-link'>
          <p>{title}</p>
          {editButton && (
            <p
              className='software-attributes-title-edit-link'
              onClick={() => handlePressEdit()}
            >
              {format('app.edit.label')}
            </p>
          )}
        </div>
      )}

      {deleteConfirmModalOpen && (
        <ConfirmModal
          title={format('software_details.delete_confirm_modal.title')}
          onClose={() => setDeleteConfirmModalOpen(false)}
        >
          <div className='confirm-delete-modal'>
            <p> {format('software_details.delete_confirm_modal.message')} </p>
            <div>
              <Button
                type='button'
                onClick={() => setDeleteConfirmModalOpen(false)}
                text={format('software_details.delete_confirm_modal.cancel')}
                styles='secondary-button'
              />
              <Button
                type='button'
                onClick={onEntryDelete}
                text={format('software_details.delete_confirm_modal.delete')}
                styles='primary-red-button'
              />
            </div>
          </div>
        </ConfirmModal>
      )}

      {children}
    </div>
  );
};

export default SoftwareDetails;
