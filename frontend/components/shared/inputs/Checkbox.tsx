import classNames from 'classnames';
import { useState } from 'react';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  const handleCheckboxChange = () => {
    onChange(!checked);
  };
  // const [isChecked, setIsChecked] = useState(false);
  // console.log('isChecked', isChecked);

  return (
    <div className="checkbox-container">
      <input
        // key={key}
        // name={name}
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
