import classNames from 'classnames';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, className }) => {
  const handleCheckboxChange = () => {
    onChange && onChange(!checked);
  };

  return (
    <div className="checkbox-container">
      <input
        type="checkbox"
        className={className ? className : classNames('checkbox', { checked })}
        onChange={handleCheckboxChange}
        checked={checked}
      />
      <span>{label}</span>
    </div>
  );
};

export default Checkbox;
