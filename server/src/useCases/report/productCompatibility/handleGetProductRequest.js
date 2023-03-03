const FiltersValidation = require('./utils/filtersValidation');

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

module.exports = class ReportGetProductRequestHandler {
  constructor(request, response) {
    this.req = request;
    this.res = response;
    this.dbConnect = request.app.locals.reportCollection;
  }

  async getReports(repository) {
    const { limit, offset } = this.req.query;

    let validatedLimit;
    validatedLimit = FiltersValidation.isFilterValid(limit) ? limit : null;
    validatedLimit = FiltersValidation.maxLimitCheck(validatedLimit);

    const validatedOffset = FiltersValidation.isFilterValid(offset) ? offset : null;

    repository.aggregateByProduct({ validatedLimit, validatedOffset }, (err, result) => {
      if (err) {
        console.error(err);
        this.res.status(500).send(`Failed to fetch report summary. Details: \n\t${err}\nPlease contact administrator.`);
        return;
      }
      this.res.json(result);
    });
  }
};
