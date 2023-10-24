import classNames from 'classnames';
import React from 'react';
import { AiFillDashboard } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import {
  FaChartPie,
  FaBrain,
  FaRegCheckCircle,
  FaList,
  FaCartArrowDown,
  FaLock,
  FaRegCompass,
  FaIdCard,
  FaSitemap,
  FaRegCommentDots,
  FaClipboardList,
  FaRegCalendarAlt,
  FaCodeBranch,
  FaGraduationCap,
} from 'react-icons/fa';
import {
  FaMoneyCheckDollar,
  FaRegHandshake,
  FaRegClipboard,
  FaMobileScreenButton,
  FaDatabase,
  FaBook,
} from 'react-icons/fa6';
import { VscFiles } from 'react-icons/vsc';

type Props = {
  imagePath: string;
  customStyle?: string;
};

const BBImage = ({ imagePath, customStyle }: Props) => {
  let icon;
  switch (imagePath) {
  case 'analytics_and_business_intel':
    icon = <FaChartPie />;
    break;
  case 'artificial_intelligence':
    icon = <FaBrain />;
    break;
  case 'bb-consent':
    icon = <FaRegCheckCircle />;
    break;
  case 'bb-digital-registries':
    icon = <FaList />;
    break;
  case 'bb-emarketplace':
    icon = <FaCartArrowDown />;
    break;
  case 'bb-esignature':
    icon = <FaLock />;
    break;
  case 'bb-gis':
    icon = <FaRegCompass />;
    break;
  case 'bb-identity':
    icon = <FaIdCard />;
    break;
  case 'bb-information-mediator':
    icon = <FaSitemap />;
    break;
  case 'bb-messaging':
    icon = <FaRegCommentDots />;
    break;
  case 'bb-payments':
    icon = <FaMoneyCheckDollar />;
    break;
  case 'bb-registration':
    icon = <FaClipboardList />;
    break;
  case 'bb-scheduler':
    icon = <FaRegCalendarAlt />;
    break;
  case 'bb-workflow':
    icon = <FaCodeBranch />;
    break;
  case 'client_case_management':
    icon = <BsPersonCircle />;
    break;
  case 'data_collection':
    icon = <FaRegClipboard />;
    break;
  case 'elearning':
    icon = <FaGraduationCap />;
    break;
  case 'mobility_management':
    icon = <FaMobileScreenButton />;
    break;
  case 'reporting_and_dashboards':
    icon = <AiFillDashboard />;
    break;
  case 'shared_data_repositories':
    icon = <FaDatabase />;
    break;
  case 'terminology':
    icon = <FaBook />;
    break;
  case 'collaboration_management':
    icon = <FaRegHandshake />;
    break;
  case 'content_management':
    icon = <VscFiles />;
    break;
  }

  return <div className={classNames('bb-image', customStyle)}>{icon}</div>;
};

export default BBImage;
