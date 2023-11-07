import useTranslations from '../../hooks/useTranslation';
import { DataType } from '../../service/types';
import Table from '../table/Table';

const SoftwareComplianceWith = () => {
  const { format } = useTranslations();
  const headers = [
    format('building_block.plural.label'),
    format('table.building_block_version.label'),
    format('table.compliance.label'),
    format('table.compliance_level.label'),
    format('table.notes'),
  ];
  const transformedData: DataType = {
    rows: [],
  };

  return <Table data={transformedData} headers={headers} />;
};

export default SoftwareComplianceWith;
