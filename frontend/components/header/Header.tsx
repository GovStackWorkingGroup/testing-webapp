import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import '../../public/images/logo.png';
import { RiQuestionLine } from 'react-icons/ri';
import { BiLogIn, BiLogOut } from 'react-icons/bi';
import {
  COMPLIANCE_TESTING_RESULT_PAGE,
  API_TESTING_RESULT_PAGE,
  DATA_PROTECTION_NOTICE_PAGE,
  IMPRINT_PAGE
} from '../../service/constants';
import useTranslations from '../../hooks/useTranslation';
import HeaderMenuButton from './HeaderMenuButton';

const Header = () => {
  const router = useRouter();
  const { format } = useTranslations();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  });

  const handleBackToHomePage = () => {
    router.push('/');
  };

  const goToDataProtectionNoticePage = () => router.push(DATA_PROTECTION_NOTICE_PAGE);
  const goToImprintPage = () => router.push(IMPRINT_PAGE);

  const handleLogin = () => {
    const apiUrl = process.env.API_URL;
    window.location.href = `${apiUrl}/auth/github`;
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleHelpClick = () => {
    const slackChannelUrl = process.env.SLACK_CHANNEL_URL;
    window.open(slackChannelUrl, '_blank');
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
            buttonTitle={format('app.software_requirements_compliance.label')}
            href={COMPLIANCE_TESTING_RESULT_PAGE}
            active={currentPath?.includes(COMPLIANCE_TESTING_RESULT_PAGE)}
          />
          <HeaderMenuButton
            buttonTitle={format('app.api-testing.label')}
            href={API_TESTING_RESULT_PAGE}
            active={currentPath?.includes(API_TESTING_RESULT_PAGE)}
          />
        </div>
        <div className="action-buttons">
          <div className="header-login">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="header-menu-button">
                <BiLogOut className="header-icon"/>
                {format('app.logout.label')}
              </button>
            ) : (
              <>
                <button onClick={handleLogin} className="header-menu-button">
                  <BiLogIn className="header-icon"/>
                  {format('app.login.label')}
                </button>
              </>
            )}
          </div>
          <div className="header-help">
            <button onClick={handleHelpClick} className="header-menu-button">
              <RiQuestionLine className="header-icon"/>
              {format('app.help.label')}
            </button>
          </div>
          <button onClick={goToImprintPage} className="header-menu-button">
            {format('app.imprint')}
          </button>
          <button onClick={goToDataProtectionNoticePage} className="header-menu-button">
            {format('app.data_protection_notice')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
