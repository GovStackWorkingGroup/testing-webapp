import { useRouter } from 'next/router';
import '../../public/images/logo.png';
import HeaderMenuButton from './HeaderMenuButton';

const Header = () => {
  const router = useRouter();

  const handleBackToHomePage = () => {
    router.push('/');
  };

  return (
    <div className='header'>
      <div
        className='header-logo'
        onClick={handleBackToHomePage}
        data-testid='logo'
      >
        <img src='/images/logo.png' alt='logo' />
      </div>
      <HeaderMenuButton onClick={() => {}} buttonTitle='Api testing' />
      <HeaderMenuButton
        onClick={() => {}}
        buttonTitle='Software Compliance Testing'
      />
      <div>help</div>
    </div>
  );
};

export default Header;
