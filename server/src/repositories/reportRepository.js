const reportRepository = (repository) => {
  const add = (report, callback) => repository.add(report, callback);
  function aggregateByProduct(filters, callback) {
    return repository.aggregateByProduct(filters, callback);
  }

  function productsCount(callback) {
    return repository.productsCount(callback);
  }

  return {
    add,
    aggregateByProduct,
    productsCount,
  };
};

module.exports = reportRepository;
