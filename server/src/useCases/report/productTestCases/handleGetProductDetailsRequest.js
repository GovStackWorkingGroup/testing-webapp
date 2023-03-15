/* eslint-disable operator-linebreak */
/* eslint-disable no-param-reassign */
/* eslint-disable object-curly-newline */
/* eslint-disable no-console */

module.exports = class ReportGetProductDetailsRequestHandler {
  constructor(request, response) {
    this.req = request;
    this.res = response;
    this.dbConnect = request.app.locals.reportCollection;
  }

  async getProductDetails(repository) {
    const { limit, offset } = this.req.query;
    const { id } = this.req.params;

    repository.aggregateByProductId({ id }, async (err, result) => {
      if (err) {
        console.error(err);
        this.res
          .status(500)
          .send(`Failed to fetch detailed report summary. Details: \n\t${err}\nPlease contact administrator.`);
        return;
      }

      const aggregatedResult = result[0];

      let tempItem = {};
      aggregatedResult.data = aggregatedResult.data.reduce((items, item) => {
        const { uri, passed, method, endpoint } = item;

        if (tempItem.uri !== uri) {
          // sliced by @method= length
          item.method = method.length > 0 ? method[0].slice(8) : '';
          // sliced by @endpoint= length
          item.endpoint = endpoint.length > 0 ? endpoint[0].slice(10) : '';

          items.push(item);
        } else if (tempItem.passed !== passed && !passed) {
          items.find((i) => i.uri === uri).passed = passed;
        }

        tempItem = item;
        return items;
      }, []);

      aggregatedResult.data.forEach((element) => {
        delete element.uri;
      });

      Object.assign(aggregatedResult, { count: aggregatedResult.data.length });

      aggregatedResult.data =
        offset !== undefined
          ? aggregatedResult.data.slice(offset, limit + offset)
          : aggregatedResult.data.slice(0, limit);

      this.res.json(aggregatedResult);
    });
  }
};
