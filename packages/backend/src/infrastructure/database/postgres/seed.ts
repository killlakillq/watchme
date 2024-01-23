import { createReadStream, createWriteStream } from 'fs';
import { faker } from '@faker-js/faker';
import { parse } from 'csv';
import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const moviesData = () => ({
  id: faker.string.uuid(),
  addedAt: faker.date.anytime(),
  title: faker.word.noun(),
  overview: faker.lorem.sentence(3),
  releaseDate: faker.date.anytime(),
  runtime: faker.number.float({ min: 1 }),
  country: faker.location.country(),
  authors: faker.person.fullName(),
  genre: faker.lorem.word(),
  ageRate: faker.number.int({ min: 1, max: 1000000 }),
  originalLanguage: faker.lorem.word(),
  budget: faker.number.bigInt(),
  revenue: faker.number.bigInt()
});

const output = './seed.csv';
const writeStream = createWriteStream(output);

const writeToCsvFile = async () => {
  const rows = 10;

  for (let index = 0; index < rows; index + 1) {
    writeStream.write(`${Object.values(moviesData()).join(', ')}\n`, 'utf-8');
  }
  writeStream.end();
};

const insertFromCsv = async () => {
  const csvData = [];

  const parser = parse({
    relax_column_count: true
  });

  return parser
    .on('data', (data) => {
      csvData.push(data);
    })
    .on('end', () => {
      prisma.movie
        .create({
          data: moviesData()
        })
        .then(() => {
          Logger.log('[SEED] Successfully created movie records');
        })
        .catch((error) => {
          Logger.log('[SEED] Failed to create movie records', error);
        });
    });
};

const seed = async () => {
  await writeToCsvFile();
  const readStream = createReadStream(output);
  readStream.pipe(await insertFromCsv());
};

seed();
