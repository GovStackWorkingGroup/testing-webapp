import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import '../../public/images/logo.png';
import { useIntl } from 'react-intl';
// should be added in the scope of TECH-957
// import { RiQuestionLine } from 'react-icons/ri';
import HeaderMenuButton from './HeaderMenuButton';

const Header = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  const handleBackToHomePage = () => {
    router.push('/');
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
            buttonTitle={format('app.software-compliance-testing.label')}
            href={'/softwareComplianceTesting'}
            active={currentPath === '/softwareComplianceTesting'}
          />
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
  );
};

export default Header;
