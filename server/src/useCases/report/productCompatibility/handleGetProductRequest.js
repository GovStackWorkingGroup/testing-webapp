/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

const FiltersValidation = require('./utils/filtersValidation');

module.exports = class ReportGetProductRequestHandler {
  constructor(request, response) {
    this.req = request;
    this.res = response;
    this.dbConnect = request.app.locals.reportCollection;
  }

  async getReports(repository) {
    const limit = FiltersValidation.validateFilter(this.req.query.limit, Infinity);
    const offset = FiltersValidation.validateFilter(this.req.query.offset, 0);

    repository.aggregateByProduct({ limit, offset }, (err, result) => {
      if (err) {
        console.error(err);
        this.res
          .status(500)
          .send(`Failed to fetch report summary. Details: \n\t${err}\nPlease contact administrator.`);
        return;
      }
      this.res.json(result);
    });
  }
};
