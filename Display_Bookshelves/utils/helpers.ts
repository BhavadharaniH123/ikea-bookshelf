// utils/helpers.ts

export type TestDataEntry = {
  category: string;
  field: string;
  value: string;
};

export function getTestValue(
  testData: TestDataEntry[],
  category: string,
  field: string
): string {
  const entry = testData.find(
    item => item.category === category && item.field === field
  );
  return entry?.value ?? '';
}