import {
  RiCheckDoubleFill,
  RiCheckboxCircleFill,
  RiFileCopyLine,
} from 'react-icons/ri';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useTranslations from '../../hooks/useTranslation';

const FormSuccessComponent = () => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const { format } = useTranslations();

  // to be changed
  const link = 'www.test_link.com';

  useEffect(() => {
    if (isLinkCopied) {
      setTimeout(() => {
        setIsLinkCopied(false);
      }, 1000);
    }
  }, [isLinkCopied]);

  const handleCopyIconClick = () => {
    navigator.clipboard.writeText(link);

    setIsLinkCopied(true);
  };

  return (
    <div className="form-success-container">
      <div className="form-success">
        <div>
          <RiCheckboxCircleFill className="success-toast-icon" />
          <p>{format('form.form_submit_success.message')}</p>
        </div>
        <div>
          <p>{format('form.form_submit_success_inform.message')}</p>
        </div>
        <div className="form-success-copy-link-section">
          <RiFileCopyLine
            className="form-success-copy-link-icon"
            onClick={() => handleCopyIconClick()}
          />
          <Link target="_blank" href={link}>
            {link}
          </Link>
        </div>
        {isLinkCopied && (
          <div className="copied-message-popup">
            <RiCheckDoubleFill className="copied-message-popup-icon" />
            <p>{format('form.copied_to_clipboard.message')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormSuccessComponent;
