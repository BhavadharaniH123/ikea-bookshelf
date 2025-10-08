import { test } from '../utils/test-base';
import { FiltersPage } from '../pages/FiltersPage';
 
 
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