import classNames from 'classnames';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  const handleCheckboxChange = () => {
    onChange(!checked);
  };

  return (
    <div className="checkbox-container">
      <input
        type="checkbox"
        className={classNames('checkbox', { checked })}
        onChange={handleCheckboxChange}
        checked={checked}
      />
      <span>{label}</span>
    </div>
  );
};

export default Checkbox;
