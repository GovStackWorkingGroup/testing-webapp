import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import useTranslations from '../../hooks/useTranslation';
import Input from '../shared/inputs/Input';
import DragDrop from '../shared/DragAndDrop';

const SoftwareAttributesForm = () => {
  const { format } = useTranslations();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      softwareName: '',
      softwareLogo: '',
      softwareWebsite: '',
      softwareDocumentation: '',
      toolDescription: '',
      email: '',
      confirmEmail: '',
    },
  });

  return (
    <>
      <div className="form-step-title">
        {format('form.fill_in_all_the_fields_below.label')}
      </div>
      <form onSubmit={() => {}}>
        <div className="form-main-container">
          <div className="form-side-container">
            <div className="form-field-container">
              <Input
                inputTitle={format('software_name.label')}
                errorMessage="xxx"
                inputKey="key-software-name"
                isInvalid={false}
                required
              />
            </div>
            <div>
              <p className="form-drag-drop-title required-field">
                {format('software_logo.label')}
              </p>
              <DragDrop />
            </div>
            <div>
              <Input
                inputTitle={format('software_website.label')}
                tipMessage={format('form.tip_website.label')}
                errorMessage="xxx"
                inputKey="key-software-website"
                isInvalid={false}
                required
              />
            </div>
            <div>
              <Input
                inputTitle={format('software_documentation.label')}
                tipMessage={format('form.tip_documentation.label')}
                errorMessage="xxx"
                inputKey="key-software-documentation"
                isInvalid={false}
                required
              />
            </div>
          </div>
          <div className="form-side-container">
            <div className="form-field-container">
              <p className="form-drag-drop-title required-field">
                {format('software_description.label')}
              </p>
              <textarea />
            </div>
            <div className="form-field-container">
              <Input
                inputTitle={format('app.email.label')}
                inputKey="key-software-email"
                isInvalid={false}
                required
              />
            </div>
            <div className="form-field-container">
              <Input
                inputTitle={format('app.email_confirm.label')}
                errorMessage="xxx"
                inputKey="key-software-email-confirm"
                isInvalid={false}
                required
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SoftwareAttributesForm;
