// import fs from 'fs';
// import path from 'path';
// import { parse } from 'csv-parse/sync';
import { test } from '../utils/test-base';
import { GiftCardPage } from '../pages/GiftCardPage';

// type TestDataRow = {
//   Category: string;
//   Field: string;
//   Value: string;
// };

// function readCSVData(filePath: string): TestDataRow[] {
//   const absolutePath = path.resolve(__dirname, '..', filePath);
//   const fileContent = fs.readFileSync(absolutePath, 'utf-8');
//   return parse(fileContent, {
//     columns: true,
//     skip_empty_lines: true,
//     trim: true
//   }) as TestDataRow[];
// }

// function getValue(testData: TestDataRow[], category: string, field: string): string {
//   const entry = testData.find(d => d.Category === category && d.Field === field);
//   if (!entry) {
//     throw new Error(`❌ Missing test data for [${category}][${field}]`);
//   }
//   return entry.Value;
// }

// const testData = readCSVData('data/testdata.csv');

function getValue(testData: { category: string; field: string; value: string }[], category: string, field: string): string {
  return testData.find(d => d.category === category && d.field === field)?.value || '';
}


test('US7: Navigate to Gift Card section and initiate purchase', async ({ page, testData }) => {
  test.setTimeout(90000);
  const giftCard = new GiftCardPage(page);

  await giftCard.gotoHomePage();
  await giftCard.acceptCookies();
  await giftCard.navigateToGiftCard();
  await giftCard.fillGiftCardDetails({
    amount: getValue(testData, 'GiftCard', 'Amount'),
    message: getValue(testData, 'GiftCard', 'Message'),
    firstName: getValue(testData, 'GiftCard', 'First Name'),
    lastName: getValue(testData, 'GiftCard', 'Last Name'),
    email: getValue(testData, 'GiftCard', 'Valid Email'),
    confirmEmail: getValue(testData, 'GiftCard', 'Valid Email')
  });
});

test('US8: Test email validation and error recovery', async ({ page,testData }) => {
  test.setTimeout(90000);
  const giftCard = new GiftCardPage(page);
  await giftCard.gotoHomePage();
  await giftCard.acceptCookies();
  await giftCard.navigateToGiftCard();
  await giftCard.fillGiftCardDetails({
    amount: getValue(testData, 'GiftCard', 'Amount'),
    message: getValue(testData, 'GiftCard', 'Message'),
    firstName: getValue(testData, 'GiftCard', 'First Name'),
    lastName: getValue(testData, 'GiftCard', 'Last Name'),
    email: getValue(testData, 'GiftCard', 'Invalid Email'),
    confirmEmail: getValue(testData, 'GiftCard', 'Valid Email')
  });
  await giftCard.submitGiftCardForm();
  await giftCard.validateEmailError();
});
