
const request = require('supertest');
const server = require('../../src/server/app.js'); 

// after all tests are done, close the server to stops Jest from hanging.
afterAll((done) => {
  server.close(done);
});

describe('GET /health', () => {
  it('should return 200 OK and status', async () => {
    const res = await request(server).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});


describe('POST /predict', () => {
  // test 1:a good request
  it('should return 200 OK and predictions for valid data', async () => {
    const res = await request(server)
      .post('/predict')
      .send({
        messages: ['hello this is ham', 'you win free prize'],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.predictions).toBeInstanceOf(Array);
    expect(res.body.predictions.length).toBe(2);
    expect(res.body.predictions[0].label).toBe('ham');
    expect(res.body.predictions[1].label).toBe('spam');
  });

  // test 2:a bad request
  it('should return 400 Bad Request for invalid data', async () => {
    const res = await request(server)
      .post('/predict')
      .send({
        messages: 97748567,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});