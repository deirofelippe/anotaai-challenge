import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client
} from '@aws-sdk/client-s3';

export type CatalogS3Input = {
  owner: string;
  catalog: any;
};

export class CatalogS3 {
  private getClient(): S3Client {
    const s3Client = new S3Client({
      region: 'sa-east-1',
      endpoint: 'http://localstack:4566',
      forcePathStyle: true,
      credentials: { accessKeyId: 'test', secretAccessKey: 'test' }
    });

    return s3Client;
  }

  public async put(input: CatalogS3Input): Promise<any> {
    try {
      const { owner, catalog } = input;

      const s3Client = this.getClient();

      const putObjectCommandInput: PutObjectCommandInput = {
        Bucket: 'catalog-bucket',
        Key: `owner-${owner}.json`,
        Body: JSON.stringify(catalog),
        ACL: 'public-read',
        ContentType: 'application/json'
      };

      const command = new PutObjectCommand(putObjectCommandInput);

      const data = await s3Client.send(command);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
