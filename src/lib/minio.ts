import { Client as MinioClient } from 'minio';

const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT ? Number(process.env.MINIO_PORT) : 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

minioClient.bucketExists(process.env.MINIO_BUCKET_NAME, (err, exists) => {
  if (err) {
    console.error('Error checking bucket existence:', err);
    return;
  }
  if (!exists) {
    // The bucket doesn't exist, so create it
    minioClient.makeBucket(process.env.MINIO_BUCKET_NAME, '', (err) => {
      if (err) {
        console.error('Error creating bucket:', err);
        return;
      }

      console.log('Bucket created successfully');
    });
  }
});

export default minioClient;
