import { RefObject, useEffect, useImperativeHandle, useState } from 'react';
import useTranslations from '../../hooks/useTranslation';
import DragDrop from '../shared/DragAndDrop';
import Checkbox from '../shared/inputs/Checkbox';
import Input from '../shared/inputs/Input';
import { SoftwareDraftDetailsType } from '../../service/types';

export type DeploymentComplianceFormValuesType = {
  documentation: { value: string | File | undefined; error: boolean };
  deploymentInstructions: { value: string | File | undefined; error: boolean };
};

export type DeploymentComplianceRef = {
  validate: () => void;
};

type FieldType = 'link' | 'file';

type DeploymentComplianceFormType = {
  deploymentComplianceFormValues: (
    value: DeploymentComplianceFormValuesType
  ) => void;
  customRef: RefObject<DeploymentComplianceRef>;
  isDeploymentComplianceFormValid: (value: boolean) => void;
  savedDraftDetail: SoftwareDraftDetailsType | undefined;
};

const DeploymentComplianceForm = ({
  savedDraftDetail,
  deploymentComplianceFormValues,
  customRef,
  isDeploymentComplianceFormValid,
}: DeploymentComplianceFormType) => {
  const { format } = useTranslations();

  const [selectedDocumentationType, setSelectedDocumentationType] =
    useState<FieldType>('link');
  const [selectedContainerType, setSelectedContainerType] =
    useState<FieldType>('link');
  const [formValues, setFormValues] =
    useState<DeploymentComplianceFormValuesType>({
      documentation: { value: '', error: false },
      deploymentInstructions: { value: '', error: false },
    });

  const checkboxOptions: { label: string; value: FieldType }[] = [
    { label: format('form.link.label'), value: 'link' },
    { label: format('form.file.label'), value: 'file' },
  ];

  useEffect(() => {
    deploymentComplianceFormValues(formValues);
  }, [formValues]);

  const handleCheckboxDocumentationChange = (value: FieldType) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      documentation: { value: '', error: false },
    }));
    setSelectedDocumentationType(value);
  };

  const handleCheckboxContainerChange = (value: FieldType) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      container: { value: '', error: false },
    }));
    setSelectedContainerType(value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: {
        value,
        error: false,
      },
    }));
  };

  const handleDocumentationSelectedFile = (selectedFile: File | undefined) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      documentation: { value: selectedFile, error: false },
    }));
  };

  const handleContainerSelectedFile = (selectedFile: File | undefined) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      container: { value: selectedFile, error: false },
    }));
  };

  const isFormValid = (values: DeploymentComplianceFormValuesType): boolean => {
    const updatedValues = { ...values };
    const entries = Object.entries(updatedValues);
    let isValid = true;

    for (const [fieldName, field] of entries) {
      if (!field.value) {
        updatedValues[
          fieldName as keyof DeploymentComplianceFormValuesType
        ].error = true;

        isValid = false;
      }
    }

    setFormValues(updatedValues);

    return isValid;
  };

  useImperativeHandle(
    customRef,
    () => ({
      validate: () => {
        isDeploymentComplianceFormValid(isFormValid(formValues));
      },
    }),
    [formValues, isDeploymentComplianceFormValid]
  );

  return (
    <>
      <div className="form-step-title">
        {format('form.filling_required.label')}
      </div>
      <div className="form-main-container">
        <div className="form-side-container">
          <div className="form-field-container">
            <p className="form-drag-drop-title required-field">
              {format('table.documentation.label')}
            </p>
            {checkboxOptions.map((option) => (
              <Checkbox
                key={option.value}
                label={option.label}
                checked={option.value === selectedDocumentationType}
                onChange={() => handleCheckboxDocumentationChange(option.value)}
              />
            ))}
          </div>
          {selectedDocumentationType === 'link' && (
            <div className="form-field-container">
              <Input
                name="documentation"
                errorMessage={format('form.required_field.message')}
                inputKey="key-software-documentation"
                isInvalid={formValues.documentation.error}
                required
                onChange={(event) => handleInputChange(event)}
                value={formValues.documentation.value as string}
                tipMessage={format('form.tip_paste_link_documentation.label')}
              />
            </div>
          )}
          {selectedDocumentationType === 'file' && (
            <div className="form-field-container">
              <DragDrop
                selectedFile={(selectedFile) =>
                  handleDocumentationSelectedFile(selectedFile)
                }
                isInvalid={formValues.documentation.error}
                name="documentation"
                defaultFile={undefined}
                uploadFileType="document"
              />
            </div>
          )}
        </div>
        <div className="form-side-container">
          <div className="form-field-container">
            <p className="form-drag-drop-title required-field">
              {format('form.container.label')}
            </p>
            {checkboxOptions.map((option) => (
              <Checkbox
                key={option.value}
                label={option.label}
                checked={option.value === selectedContainerType}
                onChange={() => handleCheckboxContainerChange(option.value)}
              />
            ))}
          </div>
          {selectedContainerType === 'link' && (
            <div className="form-field-container">
              <Input
                name="container"
                errorMessage={format('form.required_field.message')}
                inputKey="key-software-container"
                isInvalid={formValues.deploymentInstructions.error}
                required
                onChange={(event) => handleInputChange(event)}
                value={formValues.deploymentInstructions.value as string}
                tipMessage={format('form.tip_paste_link_container.label')}
              />
            </div>
          )}
          {selectedContainerType === 'file' && (
            <div className="form-field-container">
              <DragDrop
                selectedFile={(selectedFile) => {
                  handleContainerSelectedFile(selectedFile);
                }}
                isInvalid={formValues.deploymentInstructions.error}
                name="container"
                defaultFile={undefined}
                uploadFileType="document"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DeploymentComplianceForm;
