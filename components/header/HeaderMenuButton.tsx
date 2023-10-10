
type Props = {
  buttonTitle: string,
  onClick: () => void
};

const HeaderMenuButton = ({ buttonTitle, onClick }: Props) => {
  return <button onClick={onClick} className='header-menu-button'>{buttonTitle}</button>;
};

export default HeaderMenuButton;