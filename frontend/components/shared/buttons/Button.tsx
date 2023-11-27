import classNames from 'classnames';
import Link from 'next/link';

type ButtonProps = {
  text: string;
  onClick?: () => void;
  styles: string;
  type: 'link' | 'button';
  href?: string | URL;
  disabled?: boolean;
};

const Button = ({
  text,
  onClick,
  styles,
  type,
  href,
  disabled = false,
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
          {text}
        </button>
      )}
    </>
  );
};

export default Button;
