import { Filters } from "../../@types/shared/commonTypes";
import { ReportRepository, TestReport } from "../../@types/report/reportInterfaces";
import { Document, Callback } from "mongoose";

const reportRepository = (repository: ReportRepository): ReportRepository => {
  const add = (report: TestReport, callback: Callback): void =>repository.add(report, callback);
  function aggregateCompatibilityByProduct(filters: Filters, sorting: Record<string, number>, callback: Callback) {
    return repository.aggregateCompatibilityByProduct(filters, sorting, callback);
  }

  function productsCount(filters: Filters, callback: Callback) {
    return repository.productsCount(filters, callback);
  }

  function aggregateBBDetailsByProductId(params: { id: string; }, sorting: Record<string, number>, callback: Callback) {
    return repository.aggregateBBDetailsByProductId(params, sorting, callback);
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
