import { ComplianceDbRepository } from "myTypes";

const complianceRepository = (repository: ComplianceDbRepository) => {
  const findAll = async () => {
    return repository.findAll();
  };

  const aggregateComplianceReports = async (limit, offset) => {
    try {
      return await repository.aggregateComplianceReports(limit, offset);
    } catch (error) {
      console.error('There was an error while aggregating the compliance reports:', error);
      throw error;
    }
  };

  const getSoftwareComplianceDetail = async (softwareName: string) => {
    try {
      return await repository.getSoftwareComplianceDetail(softwareName);
    } catch (error) {
      console.error('There was an error while aggregating the compliance reports:', error);
      throw error;
    }
  };

  return {
    findAll,
    aggregateComplianceReports,
    getSoftwareComplianceDetail
  };
};

export default complianceRepository;
