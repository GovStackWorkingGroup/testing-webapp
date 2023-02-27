module.exports = class FiltersValidation {
  static validateFilter(filter, defaultValue) {
    return filter === undefined || !filter.match(/^\d+$/)
      ? defaultValue
      : filter;
  }
};
