const complianceRepository = (repository) => {
  const findAll = async () => {
    return repository.find();
  };

  const aggregateComplianceReports = async () => {
    return repository.aggregateComplianceReports();
  };

  return {
    findAll,
    aggregateComplianceReports
  };
};

export default complianceRepository;
