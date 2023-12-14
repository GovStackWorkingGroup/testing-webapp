import { useRouter } from 'next/router';
import React from 'react';
import '../../public/images/logo.png';
// should be added in the scope of TECH-957
// import { RiQuestionLine } from 'react-icons/ri';
import { COMPLIANCE_TESTING_RESULT_PAGE } from '../../service/constants';
import useTranslations from '../../hooks/useTranslation';
import HeaderMenuButton from './HeaderMenuButton';
import { BiLogIn } from "react-icons/bi";

const Header = () => {
  const router = useRouter();
  const { format } = useTranslations();

  const handleBackToHomePage = () => {
    router.push('/');
  };

  const handleLogin = () => {
    const apiUrl = process.env.API_URL;
    window.location.href = `${apiUrl}/auth/github`;
  };

  const currentPath = router.pathname;

  return (
    <div className="header">
      <div
        className="header-logo"
        onClick={handleBackToHomePage}
        data-testid="logo"
      >
        <img src="/images/logo.png" alt="logo" />
      </div>
      <div className="header-right-section">
        <div className="header-link-button-section">
          <HeaderMenuButton
            buttonTitle={format('app.api-testing.label')}
            href={'/'}
            active={currentPath === '/'}
          />
          <HeaderMenuButton
            buttonTitle={format('app.software_requirements_compliance.label')}
            href={COMPLIANCE_TESTING_RESULT_PAGE}
            active={currentPath?.includes(COMPLIANCE_TESTING_RESULT_PAGE)}
          />
        </div>
        <div className="action-buttons">
          <div className="header-login">
            <div>
              <button onClick={handleLogin} className="header-menu-button">
                <BiLogIn className="login-icon" />
                {format('app.login.label')}
              </button>
            </div>
          </div>
          <div className="header-help">
            {/* should be added in the scope of TECH-957 */}
            {/* <div className="header-help-section">
            <RiQuestionLine />
            <p>{format('app.help.label')}</p>
          </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
