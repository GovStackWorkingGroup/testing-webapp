/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

module.exports = class ProductCountRequestHandler {
  constructor(request, response) {
    this.req = request;
    this.res = response;
    this.dbConnect = request.app.locals.reportCollection;
  }

  async getProductsCount(repository) {
    repository.productsCount((err, result) => {
      if (err) {
        console.error(err);
        this.res.status(500).send(`Failed to fetch products count. Details: \n\t${err}\nPlease contact administrator.`);
        return;
      }
      this.res.json(result[0]);
    });
  }
};
