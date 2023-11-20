import { useState } from 'react';
import useTranslations from '../../hooks/useTranslation';
import DragDrop from '../shared/DragAndDrop';
import Checkbox from '../shared/inputs/Checkbox';
import Input from '../shared/inputs/Input';

const DeploymentComplianceForm = () => {
  const { format } = useTranslations();

  const [selectedDocumentationType, setSelectedDocumentationType] =
    useState<string>('link');
  const [selectedContainerType, setSelectedContainerType] =
    useState<string>('link');
  const [formValues, setFormValues] = useState({});

  const checkboxOptions = [
    { label: format('form.link.label'), value: 'link' },
    { label: format('form.file.label'), value: 'file' },
  ];

  const handleCheckboxDocumentationChange = (value: string) => {
    setSelectedDocumentationType(value);
  };

  const handleCheckboxContainerChange = (value: string) => {
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
      documentation: { value: selectedFile, error: false },
    }));
  };

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
                name="softwareDocumentation"
                errorMessage={format('form.required_field.message')}
                inputKey="key-software-documentation"
                isInvalid={false}
                required
                onChange={(event) => handleInputChange(event)}
                value={''}
              />
            </div>
          )}
          {selectedDocumentationType === 'file' && (
            <div className="form-field-container">
              <DragDrop
                selectedFile={(selectedFile) =>
                  handleDocumentationSelectedFile(selectedFile)
                }
                isInvalid={false}
                name="documentationFile"
                key="documentationFile"
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
                name="softwareContainer"
                errorMessage={format('form.required_field.message')}
                inputKey="key-software-container"
                isInvalid={false}
                required
                onChange={(event) => handleInputChange(event)}
                value={''}
              />
            </div>
          )}
          {selectedContainerType === 'file' && (
            <div className="form-field-container">
              <DragDrop
                selectedFile={(selectedFile) =>
                  handleContainerSelectedFile(selectedFile)
                }
                isInvalid={false}
                name="containerFile"
                key="containerFile"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DeploymentComplianceForm;
