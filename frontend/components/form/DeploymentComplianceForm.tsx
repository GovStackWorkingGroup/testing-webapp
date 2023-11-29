import { RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslations from '../../hooks/useTranslation';
import DragDrop from '../shared/DragAndDrop';
import Checkbox from '../shared/inputs/Checkbox';
import Input from '../shared/inputs/Input';
import { DEPLOYMENT_COMPLIANCE_STORAGE_NAME } from '../../service/constants';
import { fetchFileDetails } from '../../service/serviceAPI';
import useGetDraftData from '../../hooks/useGetDraftDetail';
import { deploymentComplianceDefaultValues } from './helpers';

export type DeploymentComplianceFormValuesType = {
  documentation: { value: string | File | undefined; error: boolean };
  deploymentInstructions: { value: string | File | undefined; error: boolean };
};

export type DeploymentComplianceRef = {
  validate: () => boolean;
};

type FieldType = 'link' | 'file';

type DeploymentComplianceFormType = {
  customRef: RefObject<DeploymentComplianceRef>;
  onEdited: (hasError: boolean) => void;
  deploymentComplianceFormValues: (
    value: DeploymentComplianceFormValuesType
  ) => void;
};

const DeploymentComplianceForm = ({
  deploymentComplianceFormValues,
  customRef,
  onEdited,
}: DeploymentComplianceFormType) => {
  const { format } = useTranslations();

  const [selectedDocumentationType, setSelectedDocumentationType] =
    useState<FieldType>('link');
  const [selectedContainerType, setSelectedContainerType] =
    useState<FieldType>('link');
  const [formValues, setFormValues] =
    useState<DeploymentComplianceFormValuesType>({
      documentation: { value: undefined, error: false },
      deploymentInstructions: { value: undefined, error: false },
    });
  const [savedInLocalStorage, setSavedInLocalStorage] =
    useState<DeploymentComplianceFormValuesType | null>(null);

  const router = useRouter();
  const { draftUUID } = router.query;

  const { draftData } = useGetDraftData({
    draftUUID: (draftUUID as string) || undefined,
  });

  const checkboxOptions: { label: string; value: FieldType }[] = [
    { label: format('form.link.label'), value: 'link' },
    { label: format('form.file.label'), value: 'file' },
  ];

  useEffect(() => {
    deploymentComplianceFormValues(formValues);
  }, [formValues]);

  useEffect(() => {
    const savedSoftwareAttributesInStorage = JSON.parse(
      localStorage.getItem(DEPLOYMENT_COMPLIANCE_STORAGE_NAME as string) ||
        'null'
    );
    setSavedInLocalStorage(savedSoftwareAttributesInStorage);
  }, []);

  useEffect(() => {
    if (savedInLocalStorage) {
      const savedFormValues = savedInLocalStorage;
      if (
        savedInLocalStorage.deploymentInstructions.value &&
        Object.keys(savedInLocalStorage.deploymentInstructions.value as object)
          .length === 0
      ) {
        savedFormValues.deploymentInstructions.value = undefined;
      }

      if (
        savedInLocalStorage.documentation.value &&
        Object.keys(savedInLocalStorage.documentation.value as object)
          .length === 0
      ) {
        savedFormValues.documentation.value = undefined;
      }

      setFormValues(savedFormValues);

      return;
    }

    if (draftData) {
      const fetchFile = async (path: string) => {
        return await fetchFileDetails(path);
      };

      const documentationPromise =
        typeof draftData.deploymentCompliance.documentation === 'string' &&
        draftData.deploymentCompliance.documentation.startsWith('uploads/')
          ? fetchFile(draftData.deploymentCompliance.documentation)
          : Promise.resolve(null);

      const deploymentInstructionsPromise =
        typeof draftData.deploymentCompliance.deploymentInstructions ===
          'string' &&
        draftData.deploymentCompliance.deploymentInstructions.startsWith(
          'uploads/'
        )
          ? fetchFile(draftData.deploymentCompliance.deploymentInstructions)
          : Promise.resolve(null);

      Promise.all([documentationPromise, deploymentInstructionsPromise]).then(
        ([documentation, deploymentInstructions]) => {
          if (documentation) {
            setSelectedDocumentationType('file');
          }

          if (deploymentInstructions) {
            setSelectedContainerType('file');
          }

          const draftDetail = {
            documentation: {
              value:
                documentation ?? draftData.deploymentCompliance.documentation,
              error: false,
            },
            deploymentInstructions: {
              value:
                deploymentInstructions ??
                draftData.deploymentCompliance.deploymentInstructions,
              error: false,
            },
          };

          setFormValues(draftDetail);
        }
      );

      return;
    }

    if (!savedInLocalStorage && !draftData) {
      setFormValues(deploymentComplianceDefaultValues);
    }
  }, [draftData, savedInLocalStorage]);

  useEffect(() => {
    const hasError = Object.values(formValues).some((value) => {
      return value.error;
    });

    onEdited(hasError);
  }, [formValues]);

  const handleSaveInLocalStorage = (
    values: DeploymentComplianceFormValuesType
  ) => {
    localStorage.removeItem(DEPLOYMENT_COMPLIANCE_STORAGE_NAME);
    localStorage.setItem(
      DEPLOYMENT_COMPLIANCE_STORAGE_NAME,
      JSON.stringify(values)
    );
  };

  const handleCheckboxDocumentationChange = (value: FieldType) => {
    const updatedValues = {
      ...formValues,
      documentation: { value: undefined, error: false },
    };
    setFormValues(updatedValues);
    setSelectedDocumentationType(value);
    handleSaveInLocalStorage(updatedValues);
  };

  const handleCheckboxContainerChange = (value: FieldType) => {
    const updatedValues = {
      ...formValues,
      deploymentInstructions: { value: undefined, error: false },
    };
    setFormValues(updatedValues);
    setSelectedContainerType(value);
    handleSaveInLocalStorage(updatedValues);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedValues = {
      ...formValues,
      [name]: {
        value: value.length === 0 ? '' : value,
        error: false,
      },
    };

    setFormValues(updatedValues);
    handleSaveInLocalStorage(updatedValues);
  };

  const handleDocumentationSelectedFile = (selectedFile: File | undefined) => {
    const updatedValues = {
      ...formValues,
      documentation: { value: selectedFile, error: false },
    };

    setFormValues(updatedValues);
  };

  const handleContainerSelectedFile = (selectedFile: File | undefined) => {
    const updatedValues = {
      ...formValues,
      deploymentInstructions: { value: selectedFile, error: false },
    };

    setFormValues(updatedValues);
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
        const isValid = isFormValid(formValues);

        return isValid;
      },
    }),
    [formValues]
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
                defaultFile={
                  formValues.documentation.value instanceof File
                    ? formValues.documentation.value
                    : undefined
                }
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
                name="deploymentInstructions"
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
                name="deploymentInstructions"
                defaultFile={
                  formValues.deploymentInstructions.value instanceof File
                    ? formValues.deploymentInstructions.value
                    : undefined
                }
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
