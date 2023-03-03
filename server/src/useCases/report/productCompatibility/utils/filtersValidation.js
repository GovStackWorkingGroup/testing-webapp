/* eslint-disable no-console */
module.exports = class FiltersValidation {
  static MAX_REPORTS_IN_REQUEST = 1000;

  static isFilterValid(filter) {
    return !Number.isNaN(Number.parseInt(filter, 10));
  }

  static maxLimitCheck(limit) {
    if (limit > this.MAX_REPORTS_IN_REQUEST) {
      console.log(`Provided limit parameter: ${limit} exceeded maximum limit: ${this.MAX_REPORTS_IN_REQUEST} and has been set to: ${this.MAX_REPORTS_IN_REQUEST}`);
      return this.MAX_REPORTS_IN_REQUEST;
    }
    return limit;
  }
};
