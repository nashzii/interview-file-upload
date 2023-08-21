import app from '../src/app';
import request from 'supertest';

import { Client as MinioClient } from 'minio';
import minioClient from '../src/lib/minio';
import { Logger } from '../src/lib/logger';

jest.mock('minio');

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
});

const mockMinioClientConstructor = jest.fn();
(MinioClient as jest.Mock).mockImplementation(mockMinioClientConstructor);
describe('Minio Client', () => {
  beforeEach(() => {
    mockMinioClientConstructor.mockClear();
  });

  it('should create a MinioClient instance with provided configuration', () => {
    mockMinioClientConstructor.mockImplementation(mockMinioClientConstructor);
    const minioClientInstance = minioClient;
    expect(minioClientInstance).toBeInstanceOf(MinioClient);
  });

  it('should mock minioClient.putObject', async () => {
    const mockPutObject = jest.fn().mockResolvedValue('mocked-etag');
    minioClient.putObject = mockPutObject;
    const etag = await minioClient.putObject(
      'BUCKET_NAME',
      'file.filename',
      'data',
    );
    expect(etag).toEqual('mocked-etag');
  });

  it('should mock minioClient.presignedGetObject', async () => {
    const mockPresignedGetObjectSuccess = jest
      .fn()
      .mockResolvedValue('mocked-shareUrl');
    minioClient.presignedGetObject = mockPresignedGetObjectSuccess;
    const shareUrl = await minioClient.presignedGetObject(
      'BUCKET_NAME',
      'file.filename',
    );
    expect(shareUrl).toEqual('mocked-shareUrl');

    const mockPresignedGetObjectError = jest
      .fn()
      .mockRejectedValue(new Error('Mocked error'));
    minioClient.presignedGetObject = mockPresignedGetObjectError;
    try {
      await minioClient.presignedGetObject('BUCKET_NAME', 'file.filename');
    } catch (err) {
      const logger = new Logger().logger;
      const mockLoggerError = jest.spyOn(logger, 'error');
      logger.error(err);
      expect(mockLoggerError).toHaveBeenCalledWith(err);
    }
  });
});
