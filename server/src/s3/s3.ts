import AWS from 'aws-sdk';
import stream from 'stream';
import { v4 as uuidv4 } from 'uuid';

type S3UploadConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  destinationBucketName: string;
  region?: string;
};

type UploadedFileResponse = {
  filename: string;
  mimetype: string;
  encoding: string;
  url: string;
};

type File = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream?: any,
};

interface IUploader {
  singleFileUploadResolver: (
    file: File,
  ) => Promise<UploadedFileResponse>;
}

type S3UploadStream = {
  writeStream: stream.PassThrough;
  promise: Promise<AWS.S3.ManagedUpload.SendData>;
};

export class AWSS3Uploader implements IUploader {
  private s3: AWS.S3;
  public config: S3UploadConfig;

  constructor (config: S3UploadConfig) {
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: 'ca-central-1',
      accessKeyId: 'AKIAYPXW62UVVNPK7HJK',
      secretAccessKey: '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',
    });

    this.s3 = new AWS.S3();
    this.config = config;
  }

  private createUploadStream (key: string): S3UploadStream {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3
        .upload({
          Bucket: 'learnlab',
          Key: key,
          Body: pass,
        })
        .promise(),
    };
  }

  private createDestinationFilePath (
    fileName: string,
  ): string {
    return `${uuidv4()}/${fileName}`;
  }

  async singleFileUploadResolver (
    file: File,
  ): Promise<UploadedFileResponse> {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const stream = createReadStream();
    const filePath = this.createDestinationFilePath(
      filename,
    );
    const uploadStream = this.createUploadStream(filePath);
    stream.pipe(uploadStream.writeStream);
    const result = await uploadStream.promise;

    return { filename, mimetype, encoding, url: result.Location };
  }
}