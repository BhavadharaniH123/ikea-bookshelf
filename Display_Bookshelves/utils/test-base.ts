import { test as baseTest } from '@playwright/test';
import { readCSVData } from './readCSV';

type TestData = {
  category: string;
  field: string;
  value: string;
};

export const test = baseTest.extend<{
  testData: TestData[];
}>({
  testData: async ({}, use) => {
    const data = readCSVData() as TestData[];
    await use(data);
  }
});