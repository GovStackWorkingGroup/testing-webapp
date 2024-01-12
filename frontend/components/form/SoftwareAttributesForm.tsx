import classNames from 'classnames';
import { RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { validate } from 'email-validator';
import { toast } from 'react-toastify';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useRouter } from 'next/router';
import useTranslations from '../../hooks/useTranslation';
import Input from '../shared/inputs/Input';
import DragDrop from '../shared/DragAndDrop';
import { SOFTWARE_ATTRIBUTES_STORAGE_NAME } from '../../service/constants';
import { fetchFileDetails } from '../../service/serviceAPI';
import useGetDraftData from '../../hooks/useGetDraftDetail';
import { softwareAttributesDefaultValues } from './helpers';

export type FormValuesType = {
  softwareName: { value: string; error: boolean };
  softwareLogo: { value: File | undefined; error: boolean };
  softwareWebsite: { value: string; error: boolean };
  softwareDocumentation: { value: string; error: boolean };
  toolDescription: { value: string; error: boolean };
  email: { value: string; error: { error: boolean; message: string } };
  confirmEmail: { value: string; error: { error: boolean; message: string } };
  softwareVersion: { value: string; error: boolean };
};

export type SoftwareAttributedRef = {
  validate: () => boolean;
};

type SoftwareAttributesFormProps = {
  softwareAttributesFormValues: (value: FormValuesType) => void;
  customRef: RefObject<SoftwareAttributedRef>;
  onEdited: (hasError: boolean) => void;
};

const SoftwareAttributesForm = ({
  softwareAttributesFormValues,
  customRef,
  onEdited,
}: SoftwareAttributesFormProps) => {
  const [formValues, setFormValues] = useState<FormValuesType>(
    softwareAttributesDefaultValues
  );
  const [savedInLocalStorage, setSavedInLocalStorage] =
    useState<FormValuesType | null>(null);

  const { format } = useTranslations();
  const router = useRouter();
  const { draftUUID } = router.query;

  const { draftData } = useGetDraftData({
    draftUUID: (draftUUID as string) || undefined,
  });

  useEffect(() => {
    const savedSoftwareAttributesInStorage = JSON.parse(
      localStorage.getItem(SOFTWARE_ATTRIBUTES_STORAGE_NAME as string) || 'null'
    );
    setSavedInLocalStorage(savedSoftwareAttributesInStorage);
  }, []);

  useEffect(() => {
    if (savedInLocalStorage) {
      const savedFormValues = savedInLocalStorage;
      if (
        savedFormValues.softwareLogo.value &&
        Object.keys(savedFormValues.softwareLogo.value as object).length === 0
      ) {
        savedFormValues.softwareLogo.value = undefined;
      }

      setFormValues(savedFormValues);

      return;
    }

    if (draftData) {
      fetchFileDetails(draftData.logo).then((logoFile) => {
        if (!logoFile) {
          toast.error(format('form.error_loading_file.message'), {
            icon: <RiErrorWarningFill className="error-toast-icon" />,
          });
        }

        const draftDetail = {
          softwareName: {
            value: draftData.softwareName,
            error: false,
          },
          softwareLogo: {
            value: logoFile ? (logoFile as File) : undefined,
            error: false,
          },
          softwareWebsite: { value: draftData.website, error: false },
          softwareDocumentation: {
            value: draftData.documentation,
            error: false,
          },
          toolDescription: {
            value: draftData.description,
            error: false,
          },
          email: {
            value: draftData.email,
            error: { error: false, message: '' },
          },
          confirmEmail: {
            value: draftData.email,
            error: { error: false, message: '' },
          },
          softwareVersion: {
            value: draftData.formDetails[0].version,
            error: false,
          },
        };
        setFormValues(draftDetail);
      });

      return;
    }

    if (!savedInLocalStorage && !draftData) {
      setFormValues(softwareAttributesDefaultValues);
    }
  }, [draftData, savedInLocalStorage]);

  useEffect(() => {
    softwareAttributesFormValues(formValues);
  }, [formValues]);

  useEffect(() => {
    const hasError = Object.values(formValues).some((value) => {
      if (typeof value.error === 'boolean') {
        return value.error;
      }

      return value.error.error;
    });

    onEdited(hasError);
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

    localStorage.removeItem(SOFTWARE_ATTRIBUTES_STORAGE_NAME);
    localStorage.setItem(
      SOFTWARE_ATTRIBUTES_STORAGE_NAME,
      JSON.stringify(formValues)
    );
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
      if (fieldName === 'softwareLogo') {
        if (!field.value) {
          updatedValues.softwareLogo.error = true;

          isValid = false;
        } else if (
          Object.keys(field.value as File).length === 0 &&
          field.value?.constructor === Object
        ) {
          updatedValues.softwareLogo.error = true;

          isValid = false;
        }
      } else if (fieldName === 'email' && typeof field.value === 'string') {
        if (field.value.trim() === '') {
          updatedValues.email.error.error = true;
          updatedValues.email.error.message = format(
            'form.required_field.message'
          );
          isValid = false;
        }

        if (!validate(field.value as string)) {
          updatedValues.email.error.error = true;
          updatedValues.email.error.message = format(
            'form.invalid_email.message'
          );
          isValid = false;
        }
      } else if (fieldName === 'confirmEmail') {
        if (!validate(field.value as string)) {
          updatedValues.confirmEmail.error.error = true;
          updatedValues.confirmEmail.error.message = format(
            'form.invalid_email.message'
          );
          isValid = false;
        }

        if (field.value !== updatedValues.email.value) {
          updatedValues.confirmEmail.error.error = true;
          updatedValues.confirmEmail.error.message = format(
            'form.invalid_email_match.message'
          );
          isValid = false;
        }
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
        const isValid = isFormValid(formValues);

        return isValid;
      },
    }),
    [formValues]
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
              isInvalid={formValues.softwareName?.error}
              required
              onChange={(event) => handleInputChange(event)}
              value={formValues.softwareName.value}
              maxLength={50}
            />
          </div>
          <div className="form-field-container">
            <Input
              name="softwareVersion"
              inputTitle={format('form.software_version.label')}
              errorMessage={format('form.required_field.message')}
              inputKey="key-software-version"
              isInvalid={formValues.softwareVersion?.error}
              required
              onChange={(event) => handleInputChange(event)}
              value={formValues.softwareVersion.value}
              maxLength={50}
            />
          </div>
          <div className="form-field-container">
            <p className="form-drag-drop-title required-field">
              {format('software_logo.label')}
            </p>
            <DragDrop
              selectedFile={(selectedFile) => handleSelectedFile(selectedFile)}
              isInvalid={formValues.softwareLogo?.error}
              defaultFile={formValues.softwareLogo.value}
              uploadFileType="image"
            />
          </div>
          <div className="form-field-container">
            <Input
              name="softwareWebsite"
              inputTitle={format('software_website.label')}
              tipMessage={format('form.tip_website.label')}
              errorMessage={format('form.required_field.message')}
              inputKey="key-software-website"
              isInvalid={formValues.softwareWebsite?.error}
              required
              onChange={(event) => handleInputChange(event)}
              value={formValues.softwareWebsite.value}
            />
          </div>
          <div className="form-field-container">
            <Input
              name="softwareDocumentation"
              inputTitle={format('software_documentation.label')}
              tipMessage={format('form.tip_documentation.label')}
              errorMessage={format('form.required_field.message')}
              inputKey="key-software-documentation"
              isInvalid={formValues.softwareDocumentation?.error}
              required
              onChange={(event) => handleInputChange(event)}
              value={formValues.softwareDocumentation.value}
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
              value={formValues.toolDescription.value}
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
            <p>{format('form.point_of_contact.label')}</p>
          </div>
          <div className="form-field-container">
            <Input
              name="email"
              inputTitle={format('app.email.label')}
              inputKey="key-software-email"
              isInvalid={formValues.email?.error?.error}
              errorMessage={formValues.email?.error?.message}
              required
              onChange={(event) => handleInputChange(event)}
              value={formValues.email.value}
              maxLength={50}
            />
          </div>
          <div className="form-field-container">
            <Input
              name="confirmEmail"
              inputTitle={format('app.email_confirm.label')}
              errorMessage={formValues.confirmEmail?.error?.message}
              inputKey="key-software-email-confirm"
              isInvalid={formValues.confirmEmail?.error?.error}
              required
              onChange={(event) => handleInputChange(event)}
              value={formValues.confirmEmail.value}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SoftwareAttributesForm;
