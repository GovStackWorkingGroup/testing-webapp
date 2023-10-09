import { Callback } from "mongoose";
import { Filters } from "../../@types/shared/commonTypes";

interface ReportRepository {
  add(report: Document, callback: Callback): void;
  aggregateCompatibilityByProduct(filters: Filters, sorting: Record<string, number>, callback: Callback): void;
  productsCount(filters: Filters, callback: Callback): void;
  aggregateBBDetailsByProductId(id: String, sorting: Record<string, number>, callback: Callback): void;
  aggregateByBuildingBlock(callback: Callback): void;
}

const reportRepository = (repository: ReportRepository): ReportRepository => {
  const add = (report: Document, callback: Callback) =>repository.add(report, callback);
  function aggregateCompatibilityByProduct(filters: Filters, sorting: Record<string, number>, callback: Callback) {
    return repository.aggregateCompatibilityByProduct(filters, sorting, callback);
  }

  function productsCount(filters: Filters, callback: Callback) {
    return repository.productsCount(filters, callback);
  }

  function aggregateBBDetailsByProductId(id: String, sorting: Record<string, number>, callback: Callback) {
    return repository.aggregateBBDetailsByProductId(id, sorting, callback);
  }

  function aggregateByBuildingBlock(callback: Callback) {
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
