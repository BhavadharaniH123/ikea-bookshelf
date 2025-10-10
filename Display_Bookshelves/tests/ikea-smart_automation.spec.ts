import { test, expect } from '../fixtures/page-fixtures';
import { getTestValue } from '../utils/helpers'; // move helper here if not already


test.describe('US1–US2: Home Page Navigation & Collection Tabs', () => {
  test('US1: Navigate to IKEA and handle cookie popup', async ({ pages }) => {
    await pages.homePage.gotoHomePage();
    await pages.homePage.acceptCookies();
  });

  test('US2: Retrieve sub-menu items under "Being-At-home"', async ({ pages }) => {
    await pages.homePage.gotoHomePage();
    await pages.homePage.acceptCookies();
    const tabs = await pages.homePage.getCollectionTabs();
    console.log('Collection Tabs:', tabs);
    expect(tabs.length).toBeGreaterThan(0); // Optional assertion
  });
});

test.describe('US3–US6: Product Search & Filtering', () => {
  test('US3: Search for "Bookshelves"', async ({ pages, testData }) => {
    const searchTerm = getTestValue(testData, 'Search', 'Bookshelves');
    await pages.FiltersPage.gotoHomePage();
    await pages.FiltersPage.acceptCookies();
    await pages.FiltersPage.searchProduct(searchTerm);
  });

  test('US4: Apply filters to Bookshelves and extract top 3 products', async ({ pages, testData }) => {
    const searchTerm = getTestValue(testData, 'Search', 'Bookshelves');
    await pages.FiltersPage.gotoHomePage();
    await pages.FiltersPage.acceptCookies();
    await pages.FiltersPage.searchProduct(searchTerm);
    await pages.FiltersPage.openAllFilters();
    await pages.FiltersPage.applyCategoryFilter();
    await pages.FiltersPage.applyPriceFilter();
    await pages.FiltersPage.applyAvailabilityFilter();
    await pages.FiltersPage.applyViewButton();
    await pages.FiltersPage.printTopProducts('Top 3 Bookshelves below ₹15,000', 3);
  });

  test('US5: Search for "Study Chairs" and apply rating filter', async ({ pages, testData }) => {
    const searchTerm = getTestValue(testData, 'Search', 'Study Chairs');
    await pages.searchResultsPage.gotoHomePage();
    await pages.searchResultsPage.acceptCookies();
    await pages.searchResultsPage.searchProduct(searchTerm);
    await pages.searchResultsPage.openAllFilters();
    await pages.searchResultsPage.applyCustomerRatingFilter();
    await pages.searchResultsPage.applyViewButton();
  });

  test('US6: Extract top 3 study chairs with highest recommendation', async ({ pages, testData }) => {
    const searchTerm = getTestValue(testData, 'Search', 'Study Chairs');
    await pages.searchResultsPage.gotoHomePage();
    await pages.searchResultsPage.acceptCookies();
    await pages.searchResultsPage.searchProduct(searchTerm);
    await pages.searchResultsPage.openAllFilters();
    await pages.searchResultsPage.applyCustomerRatingFilter();
    await pages.searchResultsPage.applyViewButton();
    await pages.searchResultsPage.printTopProducts('Top 3 Study Chairs:', 3);
  });
});

test.describe('US7–US10: Gift Card Flow', () => {
  test('US7: Navigate to Gift Card section and initiate purchase', async ({ pages, testData }) => {
    await pages.giftCardPage.gotoHomePage();
    await pages.giftCardPage.acceptCookies();
    await pages.giftCardPage.navigateToGiftCard();
    await pages.giftCardPage.fillGiftCardDetails({
      amount: getTestValue(testData, 'GiftCard', 'Amount'),
      message: getTestValue(testData, 'GiftCard', 'Message'),
      firstName: getTestValue(testData, 'GiftCard', 'First Name'),
      lastName: getTestValue(testData, 'GiftCard', 'Last Name'),
      email: getTestValue(testData, 'GiftCard', 'Valid Email'),
      confirmEmail: getTestValue(testData, 'GiftCard', 'Valid Email'),
    });
  });

  test('US8: Test email validation and error recovery', async ({ pages, testData }) => {
    await pages.giftCardPage.gotoHomePage();
    await pages.giftCardPage.acceptCookies();
    await pages.giftCardPage.navigateToGiftCard();
    await pages.giftCardPage.fillGiftCardDetails({
      amount: getTestValue(testData, 'GiftCard', 'Amount'),
      message: getTestValue(testData, 'GiftCard', 'Message'),
      firstName: getTestValue(testData, 'GiftCard', 'First Name'),
      lastName: getTestValue(testData, 'GiftCard', 'Last Name'),
      email: getTestValue(testData, 'GiftCard', 'Invalid Email'),
      confirmEmail: getTestValue(testData, 'GiftCard', 'Valid Email'),
    });
    await pages.giftCardPage.submitGiftCardForm();
    await pages.giftCardPage.validateEmailError();
  });

  test('US9: Refill valid email and resubmit gift card form', async ({ pages, testData }) => {
    await pages.cartPage.gotoHomePage();
    await pages.cartPage.acceptCookies();
    await pages.cartPage.navigateToGiftCard();
    await pages.cartPage.fillAmountAndMessage(
      getTestValue(testData, 'GiftCard', 'Amount'),
      getTestValue(testData, 'GiftCard', 'Message')
    );
    await pages.cartPage.fillName(
      getTestValue(testData, 'GiftCard', 'First Name'),
      getTestValue(testData, 'GiftCard', 'Last Name')
    );
    await pages.cartPage.correctEmail(getTestValue(testData, 'GiftCard', 'Valid Email'));
    await pages.cartPage.submitGiftCardForm();
    // Optional: await expect(page.locator('text=Thank you')).toBeVisible();
  });

  test('US10: Verify gift card appears in cart', async ({ pages, testData }) => {
    await pages.cartPage.gotoHomePage();
    await pages.cartPage.acceptCookies();
    await pages.cartPage.navigateToGiftCard();
    await pages.cartPage.fillAmountAndMessage(
      getTestValue(testData, 'GiftCard', 'Amount'),
      getTestValue(testData, 'GiftCard', 'Message')
    );
    await pages.cartPage.fillName(
      getTestValue(testData, 'GiftCard', 'First Name'),
      getTestValue(testData, 'GiftCard', 'Last Name')
    );
    await pages.cartPage.correctEmail(getTestValue(testData, 'GiftCard', 'Valid Email'));
    await pages.cartPage.submitGiftCardForm();
    await pages.cartPage.proceedToCart();
    await pages.cartPage.verifyGiftCardInCart(
      getTestValue(testData, 'GiftCard', 'Valid Email'),
      `Rs ${getTestValue(testData, 'GiftCard', 'Amount')}`
    );
  });
});