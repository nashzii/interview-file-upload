import app from '../src/app';
import request from 'supertest';
// import express from 'express';

describe('Express App Tests', () => {
  it('should respond with "OK" on /health endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });

  it('should respond with an error when uploading without a file', async () => {
    const response = await request(app).post('/upload');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'No file uploaded' });
  });

  // You can add more tests for your upload functionality, mocking dependencies as needed
  // For example, you can use a mock for minioClient and nodemailer to simulate their behavior
});
