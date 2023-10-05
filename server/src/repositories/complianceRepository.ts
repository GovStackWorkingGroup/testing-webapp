import { ComplianceDbRepository } from "myTypes";

const complianceRepository = (repository: ComplianceDbRepository) => {
  const findAll = async () => {
    return repository.findAll();
  };

  const aggregateComplianceReports = async () => {
    try {
      return await repository.aggregateComplianceReports();
    } catch (error) {
      console.error('There was an error while aggregating the compliance reports:', error);
      throw error;
    }
  };

  return {
    findAll,
    aggregateComplianceReports
  };
};

export default complianceRepository;
