Feature('Like, Unlike, and Review Restaurant');

Before(({ I }) => {
    I.amOnPage('/');
});

Scenario('Menyukai restoran', async ({ I }) => {
    // Tunggu elemen daftar restoran muncul
    I.waitForElement('#restaurant-list-content .restaurant-item', 5);
    I.seeElement('#restaurant-list-content .restaurant-item a');

    // Klik salah satu restoran
    I.click(locate('#restaurant-list-content .restaurant-item a').first());

    // Tunggu halaman detail restoran
    I.waitForElement('#restaurant-name', 5);
    I.seeElement('#favorite-button');

    // Klik tombol suka
    I.click('#favorite-button');

    // Verifikasi pesan berhasil (opsional)
    I.see('Added to Favorite', '#loading-indicator'); 
});

Scenario('Batal menyukai restoran', async ({ I }) => {
    // Buka halaman favorit
    I.amOnPage('/#/favorites');

    // Tunggu elemen daftar favorit
    I.waitForElement('#favorite-list-content .restaurant-item', 5);
    I.seeElement('#favorite-list-content .restaurant-item a');

    // Klik salah satu restoran favorit
    I.click(locate('#favorite-list-content .restaurant-item a').first());

    // Tunggu halaman detail restoran
    I.waitForElement('#restaurant-name', 5);
    I.seeElement('#favorite-button');

    // Klik tombol batal suka
    I.click('#favorite-button');

    // Verifikasi restoran dihapus dari favorit
    I.amOnPage('/#/favorites');
    I.dontSeeElement('#favorite-list-content .restaurant-item'); 
});
