import useTranslations from '../hooks/useTranslation';

const FormProgressBar = () => {
  const { format } = useTranslations();

  return (
    <div className="form-progress-bar-container">
      <div className="form-progress-bar-section">
        <div>
          <div className="form-progress-bar-no-line"></div>
          <div className="form-progress-bar-circle">1</div>
          <div className="form-progress-bar-line"></div>
        </div>
        <p className="form-progress-bar-step-title">
          {format('app.software_attributes.label')}
        </p>
      </div>
      <div className="form-progress-bar-section">
        <div>
          <div className="form-progress-bar-line"></div>
          <div className="form-progress-bar-circle">2</div>
          <div className="form-progress-bar-line"></div>
        </div>
        <p className="form-progress-bar-step-title">
          {format('table.deployment_compliance.label')}
        </p>
      </div>
      <div className="form-progress-bar-section third-section">
        <div>
          <div className="form-progress-bar-line"></div>
          <div className="form-progress-bar-circle">3</div>
          <div className="form-progress-bar-line"></div>
        </div>
        <p className="form-progress-bar-step-title">
          {format('app.interface_requirement_specification_compliance.label')}
        </p>
      </div>
      <div className="form-progress-bar-section">
        <div>
          <div className="form-progress-bar-line"></div>
          <div className="form-progress-bar-circle">4</div>
          <div className="form-progress-bar-no-line"></div>
        </div>
        <p className="form-progress-bar-step-title">
          {format('app.evaluation_summary.label')}
        </p>
      </div>
    </div>
  );
};

export default FormProgressBar;
