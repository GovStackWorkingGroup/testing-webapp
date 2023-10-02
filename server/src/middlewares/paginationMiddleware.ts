/* eslint-disable comma-dangle */
/* eslint-disable no-console */
export default {
  handlePaginationFilters: (req, _res, next) => {
    const MAX_LIMIT_IN_REQUEST = 1000;
    let { limit, offset } = req.query;

    if (limit) {
      limit = Number.parseInt(limit, 10);

      if (limit > MAX_LIMIT_IN_REQUEST) {
        console.warn(
          `Provided limit parameter: ${limit} exceeded maximum limit: ${MAX_LIMIT_IN_REQUEST} and has been set to: ${MAX_LIMIT_IN_REQUEST}`
        );
        limit = MAX_LIMIT_IN_REQUEST;
      }

      req.query.limit = Number.isNaN(limit) ? MAX_LIMIT_IN_REQUEST : limit;
    } else {
      req.query.limit = MAX_LIMIT_IN_REQUEST;
    }

    if (offset) {
      offset = Number.parseInt(offset, 10);
      req.query.offset = Number.isNaN(offset) ? 0 : offset;
    }

    next();
  },
};
