import classNames from 'classnames';
import Link from 'next/link';
import { RiCheckboxCircleFill } from 'react-icons/ri';

type ButtonProps = {
  text: string;
  onClick?: () => void;
  styles: string;
  type: 'link' | 'button';
  href?: string | URL;
  disabled?: boolean;
  showCheckIcon?: boolean;
};

const Button = ({
  text,
  onClick,
  styles,
  type,
  href,
  disabled = false,
  showCheckIcon,
}: ButtonProps) => {
  return (
    <>
      {type === 'link' && (
        <Link href={href ?? ''} className={classNames('custom-button', styles)}>
          {text}
        </Link>
      )}
      {type === 'button' && (
        <button
          onClick={onClick}
          className={classNames('custom-button', styles, { disabled })}
          disabled={disabled}
        >
          {showCheckIcon && <RiCheckboxCircleFill className="check-icon" />}
          <p>{text}</p>
        </button>
      )}
    </>
  );
};

export default Button;
