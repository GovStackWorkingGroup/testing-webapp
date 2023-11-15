import classNames from 'classnames';

type InputProps = {
  inputTitle?: string;
  errorMessage?: string;
  tipMessage?: string;
  inputKey: string;
  isInvalid: boolean;
  required?: boolean;
};

const Input = ({
  inputTitle,
  errorMessage,
  tipMessage,
  inputKey,
  isInvalid,
  required,
}: InputProps) => {
  return (
    <div className="custom-input-container" key={inputKey}>
      {inputTitle && (
        <p className={classNames({ 'required-field': required })}>
          {inputTitle}
        </p>
      )}
      <input
        className={classNames('custom-input', { error: isInvalid })}
        type="text"
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
