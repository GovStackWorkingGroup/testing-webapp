import { Document, Callback, PipelineStage } from 'mongoose';

import ReportModel from '../schemas/report';
import { getLatestReportPipeline, sortLatestReports, branchReports } from '../pipelines/latestReports';
import { getReportDetailsPipeline, sortReportDetails } from '../pipelines/reportDetails';

function addSortingToPipeline(
  sorting: Record<string, number>,
  aggregation: PipelineStage[],
  sortFunction: (sort: Record<string, number>) => PipelineStage[]
): PipelineStage[] {
  const sort = !!sorting && Object.keys(sorting).length !== 0;
  const sortedAggregation = sort ? aggregation.concat(sortFunction(sorting)) : aggregation;
  return sortedAggregation;
}

const repository = () => {
  const add = (report: Document, callback: Callback) => {
    const newReport = new ReportModel(report);
    return newReport.save(callback);
  };

  const aggregateCompatibilityByProduct = (
    filters: Filters,
    sorting: Record<string, number>,
    callback: Callback
  ) => {
    let aggregation: any[] = [];
    if (filters.branch !== undefined) {
      aggregation = aggregation.concat(branchReports(filters.branch));
    }
    aggregation = aggregation.concat(getLatestReportPipeline());
    aggregation = addSortingToPipeline(sorting, aggregation, sortLatestReports);
    // "aggregatedResult" will be of type "Aggregate<any[]>", not "any[]"
    let aggregatedResult = ReportModel.aggregate(aggregation);

    if (filters.offset !== undefined) {
      aggregatedResult.append({ $skip: filters.offset });
    }

    if (filters.limit !== undefined) {
      aggregatedResult.append({ $limit: filters.limit });
    }

    aggregatedResult.exec(callback);
  };

  const aggregateBBDetailsByProductId = (
    productId: { id: string },
    sorting: Record<string, number>,
    callback: Callback<Document[]>
  ): void => {
    const aggregation = getReportDetailsPipeline(productId.id);
    const sortedAggregation = addSortingToPipeline(sorting, aggregation, sortReportDetails);
    ReportModel.aggregate(sortedAggregation).exec(callback);
  };

  const productsCount = (filters: Filters, callback: Callback) => {
    let aggregation: any[] = [];
    if (filters.branch !== undefined) {
      aggregation = aggregation.concat(branchReports(filters.branch));
    }
    aggregation = aggregation.concat(getLatestReportPipeline());
    ReportModel.aggregate(aggregation)
      .append({ $count: 'count' })
      .exec(callback);
  };

  const aggregateByBuildingBlock = (callback: Callback) => {
    const aggregation = ReportModel.aggregate([]);
    aggregation.group({
      _id: '$buildingBlock',
      softwares: { $addToSet: '$testApp' },
    });
    aggregation.project({
      _id: 1,
      supportedSoftwares: { $size: '$softwares' },
    });
    aggregation.sort({ _id: 1 }).exec(callback);
  };

  return {
    add,
    aggregateCompatibilityByProduct,
    aggregateBBDetailsByProductId,
    productsCount,
    aggregateByBuildingBlock,
  };
};

export default repository();
