/* eslint-disable no-console */
const { mapQueryToSorting } = require('../requestUtils');

module.exports = class ReportGetProductRequestHandler {
  constructor(request, response) {
    this.req = request;
    this.res = response;
    this.dbConnect = request.app.locals.reportCollection;
  }

  async getReports(repository) {
    const { limit, offset, branch } = this.req.query;
    const mapQueryToMongo = {
      'sort.testApp': '_id.testApp',
      'sort.testSuite': '_id.testSuite',
      'sort.sourceBranch': '_id.sourceBranch',
      'sort.version': '_id.version',
      'sort.overallCompatibility': 'overallCompatibility',
      'sort.lastUpdate': 'lastUpdate',
    };
    const sorting = mapQueryToSorting(this.req.query, mapQueryToMongo);

    const filters = { limit, offset, branch };
    repository.aggregateCompatibilityByProduct(filters, sorting, async (err, result) => {
      if (err) {
        console.error(err);
        this.res.status(500).send(`Failed to fetch report summary. Details: \n\t${err}`);
        return;
      }
      this.res.json(result);
    });
  }
};
