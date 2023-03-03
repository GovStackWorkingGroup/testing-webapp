module.exports = class FiltersValidation {
  static isFilterValid(filter) {
    return !Number.isNaN(Number.parseInt(filter, 10));
  }
};
