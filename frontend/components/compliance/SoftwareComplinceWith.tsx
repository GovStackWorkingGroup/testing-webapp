import useTranslations from '../../hooks/useTranslation';
import Table from '../table/Table';
import { DataProps } from './ListOfCandidateApplicationComplianceResults';

const SoftwareComplinceWith = () => {
  const { format } = useTranslations();
  const transformedData: DataProps = {
    headers: [
      format('building_block.plural.label'),
      format('table.building_block_version.label'),
      format('table.compliance.label'),
      format('table.compliance_level.label'),
      format('table.notes'),
    ],
    rows: [],
  };

  return <Table data={transformedData} />;
};

export default SoftwareComplinceWith;
