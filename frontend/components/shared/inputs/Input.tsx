import classNames from 'classnames';
import { formatTranslationType } from '../../../service/types';

type InputProps = {
  inputTitle?: formatTranslationType;
  errorMessage?: formatTranslationType;
  tipMessage?: formatTranslationType;
  inputKey: string;
  isInvalid: boolean;
  required?: boolean;
  onChange?: (x: any) => void;
  name: string;
  value?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  maxLength?: number;
};

const Input = ({
  inputTitle,
  errorMessage,
  tipMessage,
  inputKey,
  isInvalid,
  required,
  onChange,
  name,
  value,
  className,
  defaultValue,
  disabled,
  maxLength = 200,
  ...props
}: InputProps) => {
  return (
    <div
      className={classNames('custom-input-container', className)}
      key={inputKey}
    >
      {inputTitle && (
        <p className={classNames({ 'required-field': required })}>
          {inputTitle}
        </p>
      )}
      <input
        {...props}
        name={name}
        className={classNames('custom-input', { error: isInvalid })}
        maxLength={maxLength}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
      ></input>
      {isInvalid ? (
        <p className="custom-input-error-message">{errorMessage}</p>
      ) : (
        <p className="custom-input-tip-message">
          {tipMessage ? tipMessage : ''}
        </p>
      )}
    </div>
  );
};

export default Input;
