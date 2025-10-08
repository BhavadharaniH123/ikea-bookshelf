import { test } from '../utils/test-base';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { SearchResults } from '../pages/SearchResults';
import { FiltersPage } from '../pages/FiltersPage';
import { GiftCardPage } from '../pages/GiftCardPage';


type TestData = {
  category: string;
  field: string;
  value: string;
  };
function getValue(testData: { category: string; field: string; value: string }[], category: string, field: string): string {
  return testData.find(d => d.category === category && d.field === field)?.value || '';
}


// Helper to extract value from testData array
function getTestValue(testData: TestData[], category: string, field: string): string {
  const entry = testData.find(item => item.category === category && item.field === field);
  return entry?.value ?? '';
}
test('US1: Navigate to IKEA and handle cookie popup', async ({ page }) => { 
  const home = new HomePage(page); 
  await home.gotoHomePage(); 
  await home.acceptCookies(); 
}); 

test('US2: Retrieve sub-menu items under "Being-At-home"', async ({ page }) => { 
  const home = new HomePage(page); 
  await home.gotoHomePage(); 
  await home.acceptCookies(); 
  const tabs = await home.getCollectionTabs(); 
  console.log('Collection Tabs:', tabs);
 });

 test('US3: Search for "Bookshelves"', async ({ page, testData }) => {
   test.setTimeout(60000);
   const results = new FiltersPage(page);
   await results.gotoHomePage();
   await results.acceptCookies();
   await results.searchProduct(testData.find(item => item.category === 'Search' && item.field === 'Bookshelves')?.value || '');
 });
  
 test('US4: Apply filters to Bookshelves and extract top 3 products', async ({ page, testData }) => {
   test.setTimeout(60000);
   const results = new FiltersPage(page);
   await results.gotoHomePage();
   await results.acceptCookies();
   await results.searchProduct(testData.find(item => item.category === 'Search' && item.field === 'Bookshelves')?.value || '');
   await results.openAllFilters();
   await results.applyCategoryFilter(['Storage solution systems', 'OMAR system']);
   await results.applyPriceFilter(['₹0 -', '₹5,000 -', '₹10,000 -']);
   await results.applyAvailabilityFilter();
   await results.applyViewButton();
   await results.printTopProducts('Bookshelves below ₹15,000 with open storage', 3);
 });


  test('US5: Search for "Study Chairs" and apply rating filter', async ({ page, testData }) => {
    test.setTimeout(90000);
    const results = new SearchResults(page);
    const searchTerm = getTestValue(testData, 'Search', 'Study Chairs');

    await results.gotoHomePage();       // from BasePage
    await results.acceptCookies();      // from BasePage
    await results.searchProduct(searchTerm);
    await results.openAllFilters();     // includes waitFor
    await results.applyCustomerRatingFilter();
    await results.applyViewButton();
  });

  test('US6: Extract top 3 study chairs with highest recommendation', async ({ page, testData }) => {
    test.setTimeout(90000);
    const results = new SearchResults(page);
    const searchTerm = getTestValue(testData, 'Search', 'Study Chairs');

    await results.gotoHomePage();
    await results.acceptCookies();
    await results.searchProduct(searchTerm);
    await results.openAllFilters();
    await results.applyCustomerRatingFilter();
    await results.applyViewButton();
    await results.printTopProducts('Top 3 Study Chairs:', 3);
  });




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

test('US9: Refill valid email and resubmit gift card form', async ({ page, testData }) => {
  const giftCard = new CartPage(page);

  await giftCard.gotoHomePage();
  await giftCard.acceptCookies();
  await giftCard.navigateToGiftCard();

  await giftCard.fillAmountAndMessage(
    getValue(testData, 'GiftCard', 'Amount'),
    getValue(testData, 'GiftCard', 'Message')
  );

  await giftCard.fillName(
    getValue(testData, 'GiftCard', 'First Name'),
    getValue(testData, 'GiftCard', 'Last Name')
  );

  await giftCard.correctEmail(getValue(testData, 'GiftCard', 'Valid Email'));
  // await giftCard.agreeToTerms();
  await giftCard.submitGiftCardForm();

  // Optional assertion
  // await expect(page.locator('text=Thank you')).toBeVisible();
});

test('US10: Verify gift card appears in cart', async ({ page, testData }) => {
  const cart = new CartPage(page);

  await cart.gotoHomePage();
  await cart.acceptCookies();
  await cart.navigateToGiftCard();

  await cart.fillAmountAndMessage(
    getValue(testData, 'GiftCard', 'Amount'),
    getValue(testData, 'GiftCard', 'Message')
  );

  await cart.fillName(
    getValue(testData, 'GiftCard', 'First Name'),
    getValue(testData, 'GiftCard', 'Last Name')
  );

  await cart.correctEmail(getValue(testData, 'GiftCard', 'Valid Email'));
  //await cart.agreeToTerms();
  await cart.submitGiftCardForm();
  await cart.proceedToCart();

  await cart.verifyGiftCardInCart(
    getValue(testData, 'GiftCard', 'Valid Email'),
    `Rs ${getValue(testData, 'GiftCard', 'Amount')}`
  );
});
