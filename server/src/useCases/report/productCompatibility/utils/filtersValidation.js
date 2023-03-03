module.exports = class FiltersValidation {
  static MAX_REPORTS_IN_REQUEST = 1000;

  static isFilterValid(filter) {
    return !Number.isNaN(Number.parseInt(filter, 10));
  }

  static maxLimitCheck(limit) {
    return limit > this.MAX_REPORTS_IN_REQUEST ? this.MAX_REPORTS_IN_REQUEST : limit;
  }
};
