Feature('Restaurant Application');

Before(({ I }) => {
 I.amOnPage('/');
});

Scenario('liking and unliking a restaurant', async ({ I }) => {
 // Verifikasi halaman utama dan tunggu konten load
 I.waitForElement('#restaurant-list-content', 20);
 I.see('Explore Restaurants');

 // Klik restoran pertama
 I.waitForClickable('#restaurant-list-content .cta', 20);
 const restaurantTitle = await I.grabTextFrom('#restaurant-list-content .cta');
 I.click('#restaurant-list-content .cta');

 // Like restoran
 I.waitForClickable('#likeButton', 20);
 I.click('#likeButton');

 // Pergi ke halaman favorit
 I.amOnPage('/#/favorite');
 I.waitForElement('#favorite-list-content', 20); 
 I.see(restaurantTitle);

 // Unlike restoran
 I.waitForClickable('#favorite-list-content .cta', 20);
 I.click('#favorite-list-content .cta');

 I.waitForClickable('#likeButton', 20);
 I.click('#likeButton');

 // Verifikasi restoran dihapus dari favorit
 I.amOnPage('/#/favorite');
 I.waitForElement('#favorite-list-content', 20);
 I.dontSee(restaurantTitle);
});

Scenario('showing empty favorite restaurants', ({ I }) => {
 I.amOnPage('/#/favorite');
 I.waitForElement('#favorite-list-content', 20);
 I.see('Your Favorite Restaurants');
 I.see('You have no favorite restaurants yet.', '#favorite-list-content');
});
