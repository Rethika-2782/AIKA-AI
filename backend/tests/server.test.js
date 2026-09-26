const request = require('supertest');
const express = require('express');

const app = express();
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('Health Endpoint', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
  });
});
