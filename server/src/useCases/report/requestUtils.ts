const mapQueryToSorting = (queryParams: any, queryToMongoMapping: Record<string, string>) => {
  /**

    Maps query parameters to MongoDB sorting options.
    @function mapQueryToSorting
    @param {Object} queryParams - Query parameters as key-value pairs.
    @param {Object} queryToMongoMapping - Mapping from query keys to MongoDB field names.
    @returns {Object} newParams - Mapped query parameters for MongoDB sorting.
    @throws {Error} If sorting key is unsupported or sorting order is not 'desc' or 'asc'.
    @example
    // Usage:
    const queryParams = { 'sort.name': 'asc', 'sort.age': 'desc' };
    const mapping = { 'sort.name': 'fullName', 'sort.age': 'age' };
    const sortingOptions = mapQueryToSorting(queryParams, mapping);
    // sortingOptions: { 'fullName': 1, 'age': -1 }
    */
  const sortIndicator = 'sort.';
  const mapQueryToMongo = queryToMongoMapping;
  const newParams: Record<string, number> = {};
  Object.keys(queryParams).forEach((key) => {
    const order = queryParams[key];
    if (key.startsWith(sortIndicator)) {
      const mappedParameter = mapQueryToMongo[key];
      if (!mappedParameter) {
        throw new Error(`Unsupported sorting key, supported keys are ${Object.keys(mapQueryToMongo)}`);
      }
      if (order !== 'desc' && order !== 'asc') {
        throw new Error(`Unsupported sort value for ${key}, supported values are 'desc' and 'asc'`);
      }
      newParams[mappedParameter] = order === 'desc' ? -1 : 1;
    }
  });
  return newParams;
};

export default mapQueryToSorting;
