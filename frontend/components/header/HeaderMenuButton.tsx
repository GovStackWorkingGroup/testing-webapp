import Link from 'next/link';

type Props = {
  buttonTitle: string;
  href: string | URL;
  active?: boolean;
};

const HeaderMenuButton = ({ buttonTitle, href, active }: Props) => (
  <Link
    className={`header-menu-button ${
      active ? 'header-menu-button-active' : ''
    }`}
    href={href}
    data-testid="header-menu-button"
  >
    {buttonTitle}
  </Link>
);

export default HeaderMenuButton;
