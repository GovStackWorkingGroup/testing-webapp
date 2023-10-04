const complianceRepository = (repository) => {
    const findAll = async () => {
      return repository.find();
    };
  
    return {
      findAll,
    };
  };
  
  export default complianceRepository;