const request = require('supertest');
const chai = require('chai');
const app = require('../path_to_your_express_app'); // Update this path to point to your app.js or server.js

const { expect } = chai;

describe('Report API', () => {
  it('POST REPORT', (done) => {
    request(app)
      .post('/report/upload')
      .attach('report', '/path_to_file/example_result.message')
      .field('buildingBlock', 'digital-registry')
    // Add other fields similarly
      .expect(200) // Assuming a 200 status code for success
      .end((err, res) => {
        if (err) return done(err);
        // You can add more assertions here
        done();
        expect(res);
      });
  });

//   it('GET REPORTS', (done) => {
//     request(app)
//       .get('/report')
//       .query({
//         limit: 20,
//         offset: 0,
//         // Add other query parameters similarly
//       })
//       .expect(200) // Assuming a 200 status code for success
//       .end((err, res) => {
//         if (err) return done(err);
//         // You can add more assertions here
//         done();
//       });
//   });

  // Repeat the same structure for 'GET REPORTS COUNT', 'GET REPORTS BBs', and 'GET REPORT DETAILS'
});
