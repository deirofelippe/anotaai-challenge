import { AsyncMessage, ConsumerStatus } from 'rabbitmq-client';
import { CompileCatalogUsecase } from './CompileCatalogUsecase';
import { MongoInstance } from './MongoInstance';
import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'sa-east-1',
  endpoint: 'http://localstack:4566',
  forcePathStyle: true,
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' }
});

export type Category = {
  owner: string;
  category_title: string;
  category_description: string;
};

export type Catalog = {
  owner: string;
  catalog: {
    category_title: string;
    category_description: string;
    itens: {
      title: string;
      description: string;
      price: number;
    }[];
  }[];
};

export type CompileCatalogControllerOutput = ConsumerStatus;

export type CompileCatalogControllerInput = AsyncMessage;

function sleep(time: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, time));
}

export class CompileCatalogController {
  constructor(private compileCatalogUsecase: CompileCatalogUsecase) {}

  public async execute(
    input: CompileCatalogControllerInput
  ): Promise<CompileCatalogControllerOutput> {
    await sleep(500);

    try {
      const owner = input.body.owner;

      const db = MongoInstance.getInstance();

      const catalog = await db
        .collection<Category>('catalog')
        .find({ owner: owner })
        .project<Category>({
          _id: 0,
          owner: 1,
          catalog: 1
        })
        .toArray();

      console.log('compilando o json do owner: ' + owner + '...');

      const command = new PutObjectCommand({
        Bucket: 'catalog-bucket',
        Key: `owner-${owner}.json`,
        Body: JSON.stringify(catalog),
        ACL: 'public-read',
        ContentType: 'application/json'
      });
      const data = await s3Client.send(command);

      return ConsumerStatus.ACK;
    } catch (error) {
      console.log(error);
      return ConsumerStatus.REQUEUE;
    }
  }
}
