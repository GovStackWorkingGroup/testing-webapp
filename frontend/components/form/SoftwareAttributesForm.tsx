import classNames from 'classnames';
import { RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { validate } from 'email-validator';
import useTranslations from '../../hooks/useTranslation';
import Input from '../shared/inputs/Input';
import DragDrop from '../shared/DragAndDrop';

type FormValuesType = {
  softwareName: { value: string; error: boolean };
  softwareLogo: { value: File | undefined; error: boolean };
  softwareWebsite: { value: string; error: boolean };
  softwareDocumentation: { value: string; error: boolean };
  toolDescription: { value: string; error: boolean };
  email: { value: string; error: { error: boolean; message: string } };
  confirmEmail: { value: string; error: { error: boolean; message: string } };
};

export type SoftwareAttributedRef = {
  validate: () => void;
};

type SoftwareAttributesFormProps = {
  softwareAttributesFormValues: (value: FormValuesType) => void;
  isSoftwareAttributesFormValid: (value: boolean) => void;
  customRef: RefObject<SoftwareAttributedRef>;
};

const SoftwareAttributesForm = ({
  softwareAttributesFormValues,
  isSoftwareAttributesFormValid,
  customRef,
}: SoftwareAttributesFormProps) => {
  const [formValues, setFormValues] = useState<FormValuesType>({
    softwareName: { value: '', error: false },
    softwareLogo: { value: undefined, error: false },
    softwareWebsite: { value: '', error: false },
    softwareDocumentation: { value: '', error: false },
    toolDescription: { value: '', error: false },
    email: { value: '', error: { error: false, message: '' } },
    confirmEmail: { value: '', error: { error: false, message: '' } },
  });

  const { format } = useTranslations();

  useEffect(() => {
    softwareAttributesFormValues(formValues);
  }, [formValues]);

  const setFieldValues = (
    name: string,
    value: string,
    isError: boolean
  ): FormValuesType => ({
    ...formValues,
    [name]: {
      value,
      error: {
        error: isError,
        message: isError ? format('form.invalid_email.message') : '',
      },
    },
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    if (name === 'email' || name === 'confirmEmail') {
      const isError = !validate(value);
      setFormValues(setFieldValues(name, value, isError));
    } else {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [name]: {
          value,
          error: false,
        },
      }));
    }
  };

  const handleSelectedFile = (selectedFile: File | undefined) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      softwareLogo: { value: selectedFile, error: false },
    }));
  };

  const isFormValid = (values: FormValuesType): boolean => {
    const updatedValues = { ...values };
    const entries = Object.entries(updatedValues);
    let isValid = true;

    for (const [fieldName, field] of entries) {
      if (fieldName === 'softwareLogo' && !field.value) {
        updatedValues.softwareLogo.error = true;

        isValid = false;
      } else if (fieldName === 'email' && typeof field.value === 'string') {
        if (field.value.trim() === '' || !validate(field.value as string)) {
          updatedValues.email.error.error = true;
          updatedValues.email.error.message = format(
            'form.required_field.message'
          );
        }

        isValid = false;
      } else if (fieldName === 'confirmEmail') {
        if (!validate(field.value as string)) {
          updatedValues.confirmEmail.error.error = true;
          updatedValues.confirmEmail.error.message = format(
            'form.required_field.message'
          );
        }

        if (field.value !== updatedValues.email.value) {
          updatedValues.confirmEmail.error.error = true;
          updatedValues.confirmEmail.error.message = format(
            'form.invalid_email_match.message'
          );
        }

        isValid = false;
      } else if (
        typeof field.value === 'string' &&
        fieldName !== 'email' &&
        fieldName !== 'confirmEmail'
      ) {
        if (field.value.trim() === '') {
          if ('error' in updatedValues[fieldName as keyof FormValuesType]) {
            updatedValues[fieldName as keyof FormValuesType].error = true;
          }

          isValid = false;
        } else {
          if ('error' in updatedValues[fieldName as keyof FormValuesType]) {
            updatedValues[fieldName as keyof FormValuesType].error = false;
          }
        }
      }
    }

    setFormValues(updatedValues);

    return isValid;
  };

  useImperativeHandle(
    customRef,
    () => ({
      validate: () => {
        isSoftwareAttributesFormValid(isFormValid(formValues));
      },
    }),
    [formValues, isSoftwareAttributesFormValid]
  );

  return (
    <>
      <div className="form-step-title">
        {format('form.fill_in_all_the_fields_below.label')}
      </div>
      <div className="form-main-container">
        <div className="form-side-container">
          <div className="form-field-container">
            <Input
              name="softwareName"
              inputTitle={format('software_name.label')}
              errorMessage={format('form.required_field.message')}
              inputKey="key-software-name"
              isInvalid={formValues.softwareName.error}
              required
              onChange={(event) => handleInputChange(event)}
            />
          </div>
          <div className="form-field-container">
            <p className="form-drag-drop-title required-field">
              {format('software_logo.label')}
            </p>
            <DragDrop
              selectedFile={(selectedFile) => handleSelectedFile(selectedFile)}
              isInvalid={formValues.softwareLogo.error}
            />
          </div>
          <div className="form-field-container">
            <Input
              name="softwareWebsite"
              inputTitle={format('software_website.label')}
              tipMessage={format('form.tip_website.label')}
              errorMessage={format('form.required_field.message')}
              inputKey="key-software-website"
              isInvalid={formValues.softwareWebsite.error}
              required
              onChange={(event) => handleInputChange(event)}
            />
          </div>
          <div className="form-field-container">
            <Input
              name="softwareDocumentation"
              inputTitle={format('software_documentation.label')}
              tipMessage={format('form.tip_documentation.label')}
              errorMessage={format('form.required_field.message')}
              inputKey="key-software-documentation"
              isInvalid={formValues.softwareDocumentation.error}
              required
              onChange={(event) => handleInputChange(event)}
            />
          </div>
        </div>
        <div className="form-side-container">
          <div className="form-field-container textarea">
            <p className="form-drag-drop-title required-field">
              {format('software_description.label')}
            </p>
            <textarea
              name="toolDescription"
              className={classNames('form-textarea', {
                'form-textarea-error': formValues.toolDescription.error,
              })}
              maxLength={400}
              onChange={(event) => handleInputChange(event)}
            />
            {formValues.toolDescription.error ? (
              <p className="custom-error-message">
                {format('form.required_field.message')}
              </p>
            ) : (
              <>
                <p className="form-tip-message">
                  {format('form.tip_description.label')}
                </p>
                <p className="form-tip-message">
                  {format('form.tip_max_characters.label')}
                </p>
              </>
            )}
          </div>
          <div>
            <p>Point of contact</p>
          </div>
          <div className="form-field-container">
            <Input
              name="email"
              inputTitle={format('app.email.label')}
              inputKey="key-software-email"
              isInvalid={formValues.email.error.error}
              errorMessage={formValues.email.error.message}
              required
              onChange={(event) => handleInputChange(event)}
            />
          </div>
          <div className="form-field-container">
            <Input
              name="confirmEmail"
              inputTitle={format('app.email_confirm.label')}
              errorMessage={formValues.confirmEmail.error.message}
              inputKey="key-software-email-confirm"
              isInvalid={formValues.confirmEmail.error.error}
              required
              onChange={(event) => handleInputChange(event)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SoftwareAttributesForm;
