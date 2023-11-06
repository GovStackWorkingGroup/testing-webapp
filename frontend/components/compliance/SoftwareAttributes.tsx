import useTranslations from '../../hooks/useTranslation';
import { SoftwareDetailsType } from '../../service/types';
type SoftwareAttributesProps = {
  softwareDetails: SoftwareDetailsType;
};
const SoftwareAttributes = ({ softwareDetails }: SoftwareAttributesProps) => {
  const { format } = useTranslations();
  const splittedLogoUrl = softwareDetails?.logo.split('/');
  const softwareLogo = {
    header: format('table.logo'),
    value: softwareDetails.logo,
    title: splittedLogoUrl[splittedLogoUrl.length - 1],
  };
  const data = [
    {
      header: format('test_table.name.label'),
      value: [softwareDetails.softwareName],
    },
    { header: format('table.website.label'), value: [softwareDetails.website] },
    {
      header: format('table.documentation.label'),
      value: softwareDetails.documentation,
    },
    {
      header: format('table.point_of_contact'),
      value: [softwareDetails.pointOfContact],
    },
  ];

  return (
    <div className="software-attributes-container">
      <div
        key={`software-attributes-${softwareLogo.header}`}
        className="software-attribute software-attribute-logo"
      >
        <div>
          <p>{softwareLogo.header}</p>
        </div>
        <div>
          <img
            className="img-logo"
            src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
            alt={softwareLogo.title}
          />
          <p>{softwareLogo.title}</p>
        </div>
      </div>
      {data.map((row, indexKey) => (
        <div
          key={`software-attributes-${row.header}-${indexKey}`}
          className="software-attribute"
        >
          <div>
            <p>{row.header}</p>
          </div>
          <div>
            {row.value.map((value, indexKey) => (
              <p key={`software-attributes-value-${indexKey}`}>{value}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SoftwareAttributes;
