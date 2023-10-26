type SoftwareDetailsType = {
  title: string;
  children: React.ReactNode;
};
const SoftwareDetails = ({ title, children }: SoftwareDetailsType) => (
  <div className="software-attributes-section">
    <p>{title}</p>
    {children}
  </div>
);

export default SoftwareDetails;
