const reportRepository = (repository) => {
  const add = (report, callback) => repository.add(report, callback);
  function aggregateByProduct(filters, callback) {
    return repository.aggregateByProduct(filters, callback);
  }

  function productsCount(callback) {
    return repository.productsCount(callback);
  }

  function aggregateByProductId(id, callback) {
    return repository.aggregateByProductId(id, callback);
  }

  return {
    add,
    aggregateByProduct,
    aggregateByProductId,
    productsCount,
  };
};

module.exports = reportRepository;
