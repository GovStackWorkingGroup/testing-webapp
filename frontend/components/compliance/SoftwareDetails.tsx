type SoftwareDetailsProps = {
  title: string;
  children: React.ReactNode;
  complianceSection?: boolean;
  softwareVersion?: string;
};

const SoftwareDetails = ({
  title,
  children,
  complianceSection = false,
  softwareVersion,
}: SoftwareDetailsProps) => (
  <div className="software-attributes-section">
    {complianceSection ? (
      <p>
        {title} <span className="bold">Software version {softwareVersion}</span>
      </p>
    ) : (
      <p>{title}</p>
    )}

    {children}
  </div>
);

export default SoftwareDetails;
