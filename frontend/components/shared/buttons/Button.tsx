import classNames from 'classnames';
import Link from 'next/link';

type ButtonProps = {
  text: string;
  onClick?: () => void;
  styles: string;
  type: 'link' | 'button';
  href?: string | URL;
};
const Button = ({ text, onClick, styles, type, href }: ButtonProps) => {
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
          className={classNames('custom-button', styles)}
        >
          {text}
        </button>
      )}
    </>
  );
};

export default Button;
