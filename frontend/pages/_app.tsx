import Head from 'next/head';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import 'react-tooltip/dist/react-tooltip.css';
import '../components/Definition.less';
import '../components/LoadingBar.less';
import '../components/TestStepsView.less';
import '../components/TestSummary.less';
import '../components/BuildingBlocksImage.less';
import '../components/header/Header.less';
import '../components/header/HeaderMenuButton.less';
import '../components/shared/ProgressBar.less';
import '../components/shared/DragAndDrop.less';
import '../components/compliance/SoftwareDetails.less';
import '../components/form/SoftwareForm.less';
import { RiCloseFill } from 'react-icons/ri';
import { ToastContainer } from 'react-toastify';
import MainLayout from '../components/mainLayout/MainLayout';
import '../components/shared/inputs/Inputs.less';
import '../components/shared/modals/Modal.less';
import '../components/shared/buttons/Button.less';
import '../components/mainLayout/MainLayout.less';
import '../components/table/ProductTable.less';
import '../components/table/SubTable.less';
import '../components/table/Table.less';
import '../components/table/TestResultTable.less';
import '../styles/Globals.less';
import * as translations from '../translations';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import '../components/shared/Pill.less';
import '../components/shared/combined/SelectBBs.less';
import '../components/table/IRSC/IRSCTable.less';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { locale } = router;

  const messages = {
    ...translations.en,
    ...translations[locale as keyof typeof translations],
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </Head>
      <IntlProvider
        locale={locale as keyof typeof translations}
        defaultLocale="en"
        messages={messages}
      >
        <ToastContainer
          hideProgressBar={true}
          closeButton={<RiCloseFill className="modal-close-icon" />}
        />
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </IntlProvider>
    </>
  );
};

export default App;
