import { test } from '../utils/test-base';
import { CartPage } from '../pages/CartPage';

function getValue(testData: { category: string; field: string; value: string }[], category: string, field: string): string {
  return testData.find(d => d.category === category && d.field === field)?.value || '';
}

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
