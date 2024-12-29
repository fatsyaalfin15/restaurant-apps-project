import { openDB } from 'idb';

const Favorite = {
  async render() {
    return `
      <section class="favorite-list">
        <h2>Your Favorite Restaurants</h2>
        <div id="favorite-list-content"></div>
      </section>
    `;
  },

  async afterRender() {
    try {
      const db = await openDB('restaurant-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('favorites')) {
            db.createObjectStore('favorites', { keyPath: 'id' });
          }
        },
      });

      const favorites = await db.getAll('favorites');
      const favoriteListContent = document.getElementById('favorite-list-content');
      favoriteListContent.innerHTML = favorites.length
        ? favorites
            .map(
              (restaurant) => `
        <article class="restaurant-card">
          <img 
            data-src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" 
            alt="${restaurant.name}" 
            class="lazyload restaurant-image"
            loading="lazy">
          <h3>${restaurant.name}</h3>
          <p>City: ${restaurant.city}</p>
          <p>Rating: ${restaurant.rating}</p>
          <a href="#/detail/${restaurant.id}" class="cta">View Details</a>
        </article>
        `
            )
            .join('')
        : '<p>You have no favorite restaurants yet.</p>';
    } catch (error) {
      console.error('Error displaying favorite restaurants:', error);
      document.getElementById('favorite-list-content').innerHTML =
        '<p>Failed to load favorites. Please try again later.</p>';
    }
  },
};

export default Favorite;
