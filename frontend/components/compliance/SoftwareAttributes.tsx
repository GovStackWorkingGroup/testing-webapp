import { useEffect, useState } from 'react';
import classNames from 'classnames';
import useTranslations from '../../hooks/useTranslation';
import { baseUrl, checkIfImageUrlExists } from '../../service/serviceAPI';
import { SoftwareDetailsType } from '../../service/types';

type SoftwareAttributesProps = {
  softwareDetails: SoftwareDetailsType;
  showContactDetails?: boolean;
};

const SoftwareAttributes = ({
  softwareDetails,
  showContactDetails = false,
}: SoftwareAttributesProps) => {
  const [softwareLogoExist, setSoftwareLogoExist] = useState(false);
  const { format } = useTranslations();

  const softwareDetailsParams = softwareDetails[0] ?? [];
  const dividedLogoUrl =
    softwareDetailsParams.logo && softwareDetailsParams.logo.split('/');

  const softwareLogo = {
    header: format('table.logo.label'),
    value: softwareDetailsParams.logo || '',
    title: dividedLogoUrl ? dividedLogoUrl[dividedLogoUrl.length - 1] : '',
  };

  const handleCheckUrlExistence = async (url: string | undefined) => {
    if (url) {
      const exists = await checkIfImageUrlExists(url);
      setSoftwareLogoExist(exists);
    }
  };

  useEffect(() => {
    handleCheckUrlExistence(softwareLogo.value);
  }, [softwareLogo.value]);

  return (
    <div className="software-attributes-container">
      <div
        key={`software-attributes-${softwareLogo.header}`}
        className={classNames('software-attribute', {
          'software-attribute-logo': softwareLogoExist,
        })}
      >
        <div>
          <p>{softwareLogo.header}</p>
        </div>
        <div>
          {softwareLogoExist ? (
            <img
              className="img-logo"
              src={`${baseUrl}/${softwareDetailsParams.logo}`}
              alt={softwareLogo.title}
            />
          ) : (
            <p>{softwareLogo.title}</p>
          )}
        </div>
      </div>
      <div className="software-attribute">
        <div>
          <p>{format('test_table.name.label')}</p>
        </div>
        <div>
          <p>{softwareDetailsParams.softwareName}</p>
        </div>
      </div>
      <div className="software-attribute">
        <div>
          <p>{format('table.website.label')}</p>
        </div>
        <div>
          <a
            href={softwareDetailsParams.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {softwareDetailsParams.website}
          </a>
        </div>
      </div>
      <div className="software-attribute">
        <div>
          <p>{format('table.documentation.label')}</p>
        </div>
        <div>
          <a
            href={softwareDetailsParams.documentation}
            target="_blank"
            rel="noopener noreferrer"
          >
            {softwareDetailsParams.documentation}
          </a>
        </div>
      </div>
      {showContactDetails && (
        <div className="software-attribute">
          <div>
            <p>{format('table.point_of_contact.label')}</p>
          </div>
          <div>
            <p>{softwareDetailsParams.pointOfContact}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoftwareAttributes;
