const reportRepository = (repository) => {
  const add = (report, callback) => repository.add(report, callback);
  function aggregateCompatibilityByProduct(filters, sorting, callback) {
    return repository.aggregateCompatibilityByProduct(filters, sorting, callback);
  }

  function productsCount(filters, callback) {
    return repository.productsCount(filters, callback);
  }

  function aggregateBBDetailsByProductId(id, sorting, callback) {
    return repository.aggregateBBDetailsByProductId(id, sorting, callback);
  }

  function aggregateByBuildingBlock(callback) {
    return repository.aggregateByBuildingBlock(callback);
  }

  return {
    add,
    aggregateCompatibilityByProduct,
    aggregateBBDetailsByProductId,
    productsCount,
    aggregateByBuildingBlock,
  };
};

export default reportRepository;
