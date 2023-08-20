import 'dotenv/config';
import express, { Request, Response } from 'express';
import expressWinston from 'express-winston';
import fs from 'fs';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { UploadedObjectInfo } from 'minio';

import minioClient from './lib/minio';
import sendMail from './lib/nodemailer';
import { Logger, logOption } from './lib/logger';

const app = express();

app.use(
  expressWinston.logger({
    ...logOption,
    msg: 'HTTP {{req.method}} {{req.url}}',
    colorize: true,
  } as expressWinston.LoggerOptions),
);

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../temp_uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

app.use(helmet());

app.get('/health', (req: Request, res: Response) => {
  res.send('OK');
});

app.post(
  '/upload',
  upload.single('file'),
  async (req: Request, res: Response) => {
    const file = req.file;
    const logger = new Logger().logger;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let data: Buffer;
    try {
      data = await readFileAsync(file.path, null);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'Failed to read file' });
    }
    let etag: UploadedObjectInfo;
    try {
      etag = await minioClient.putObject(BUCKET_NAME, file.filename, data);
      logger.info('File uploaded to MinIO successfully. Etag:' + etag.etag);
      unlinkAsync(file.path);
    } catch (err) {
      logger.error(err);
      unlinkAsync(file.path);
      return res.status(500).json({ error: 'Failed to upload file to MinIO' });
    }

    let shareUrl: string;
    try {
      shareUrl = await minioClient.presignedGetObject(
        BUCKET_NAME,
        file.filename,
      );
    } catch (err) {
      logger.error(err);
    }

    try {
      await sendMail(req.body.email, shareUrl);
      logger.info('Send mail completed to ' + req.body.email);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'Failed to send email' });
    }
    return res.json({ message: 'File uploaded and notification successfully' });
  },
);

export default app;
