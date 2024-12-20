Feature('Liking and Unliking Restaurants');

Before(({ I }) => {
  I.amOnPage('/');
});

Scenario('liking and unliking a restaurant', async ({ I }) => {
  
  I.see('Explore Restaurants');
  I.waitForElement('#restaurant-list', 10);
  I.waitForElement('#restaurant-list-content', 10);
  
  I.waitForFunction(() => {
    return document.querySelector('#restaurant-list-content').children.length > 0
  }, 10);

  const firstRestaurantLink = locate('#restaurant-list-content a').first();
  I.waitForElement(firstRestaurantLink, 10);
  const restaurantTitle = await I.grabTextFrom(firstRestaurantLink);
  I.click(firstRestaurantLink);

  I.waitForElement('#restaurant-detail', 10);
  I.seeElement('#restaurant-name');
  
  I.waitForElement('#favorite-button', 10);
  I.click('#favorite-button');
  
  
  I.click('Favorite');
  I.waitForElement('#favorite-list', 10);
  I.see('Your Favorite Restaurants');
  
  
  I.waitForElement('#favorite-list-content', 10);
  I.waitForFunction(() => {
    return document.querySelector('#favorite-list-content').children.length > 0
  }, 10);
  I.see(restaurantTitle);
  
  // Click the favorited restaurant
  I.click(locate('#favorite-list-content a').first());
  
  // Unlike the restaurant
  I.waitForElement('#favorite-button', 10);
  I.click('#favorite-button');
  
  // Return to favorites page
  I.click('Favorite');
  I.waitForElement('#favorite-list', 10);
  
  // Verify restaurant is no longer in favorites
  I.dontSee(restaurantTitle);
});

// Additional helper scenario to verify initial state
Scenario('showing empty favorite restaurants', async ({ I }) => {
  I.click('Favorite');
  I.waitForElement('#favorite-list', 10);
  I.see('Your Favorite Restaurants');
  I.waitForElement('#favorite-list-content', 10);
  I.dontSeeElement(locate('#favorite-list-content a'));
});
