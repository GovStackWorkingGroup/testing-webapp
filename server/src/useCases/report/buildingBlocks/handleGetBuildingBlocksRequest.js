/* eslint-disable no-console */
module.exports = class ReportGetBuildingBlocksRequestHandler {
  constructor(request, response) {
    this.req = request;
    this.res = response;
    this.dbConnect = request.app.locals.reportCollection;
  }

  async getBuildingBlocks(repository) {
    repository.aggregateByBuildingBlock(async (err, result) => {
      if (err) {
        console.error(err);
        this.res.status(500).send(`Failed to fetch building blocks list. Details: \n\t${err}`);
        return;
      }
      this.res.json(result);
    });
  }
};
