import { openDB } from 'idb';

const Detail = {
  async render() {
    return `
      <section class="restaurant-detail">
        <h2 id="restaurant-name"></h2>
        <img 
          id="restaurant-image" 
          alt="Restaurant image" 
          class="restaurant-image" 
          loading="lazy">
        <div class="restaurant-info">
          <p><strong>Address:</strong> <span id="restaurant-address"></span></p>
          <p><strong>City:</strong> <span id="restaurant-city"></span></p>
          <p><strong>Rating:</strong> <span id="restaurant-rating"></span></p>
          <div class="categories">
            <strong>Categories:</strong>
            <span id="restaurant-categories"></span>
          </div>
        </div>
        
        <div class="menus">
          <h3>Menu</h3>
          <div class="menu-section">
            <h4>Foods</h4>
            <ul id="foods-list"></ul>
          </div>
          <div class="menu-section">
            <h4>Drinks</h4>
            <ul id="drinks-list"></ul>
          </div>
        </div>

        <div class="description">
          <h3>Description</h3>
          <p id="restaurant-description"></p>
        </div>

        <section id="customer-reviews">
          <h3>Customer Reviews</h3>
          <ul id="reviews-list"></ul>
        </section>
        
        <div id="likeButtonContainer"></div>
      </section>
    `;
  },

  async afterRender() {
    try {
      // Show loading indicator
      document.getElementById('loading-indicator').style.display = 'block';
      
      const url = window.location.hash.split('/')[2];
      const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${url}`);
      const { restaurant } = await response.json();

      // Update the DOM with restaurant details
      document.getElementById('restaurant-name').innerText = restaurant.name;
      const restaurantImage = document.getElementById('restaurant-image');
      restaurantImage.src = `https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}`;
      restaurantImage.alt = `Image of ${restaurant.name}`;
      document.getElementById('restaurant-address').innerText = restaurant.address;
      document.getElementById('restaurant-city').innerText = restaurant.city;
      document.getElementById('restaurant-rating').innerText = restaurant.rating;
      document.getElementById('restaurant-categories').innerText = 
        restaurant.categories.map(category => category.name).join(', ');
      document.getElementById('restaurant-description').innerText = restaurant.description;

      // Populate menus
      const foodsList = document.getElementById('foods-list');
      foodsList.innerHTML = restaurant.menus.foods
        .map(food => `<li>${food.name}</li>`)
        .join('');

      const drinksList = document.getElementById('drinks-list');
      drinksList.innerHTML = restaurant.menus.drinks
        .map(drink => `<li>${drink.name}</li>`)
        .join('');

      // Populate reviews
      const reviewsList = document.getElementById('reviews-list');
      reviewsList.innerHTML = restaurant.customerReviews
        .map(review => `
          <li class="review-item">
            <p class="review-name"><strong>${review.name}</strong></p>
            <p class="review-date">${review.date}</p>
            <p class="review-text">${review.review}</p>
          </li>
        `)
        .join('');

      // Add like button logic
      const db = await openDB('restaurant-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('favorites')) {
            db.createObjectStore('favorites', { keyPath: 'id' });
          }
        },
      });

      const isFavorite = await db.get('favorites', restaurant.id);
      const likeButtonContainer = document.querySelector('#likeButtonContainer');
      likeButtonContainer.innerHTML = `
        <button id="likeButton" class="like-button ${isFavorite ? 'liked' : ''}">
          ${isFavorite ? 'Unlike' : 'Like'}
        </button>
      `;

      document.getElementById('likeButton').addEventListener('click', async () => {
        const tx = db.transaction('favorites', 'readwrite');
        const store = tx.objectStore('favorites');
        if (isFavorite) {
          await store.delete(restaurant.id);
        } else {
          await store.put(restaurant);
        }
        location.reload();
      });
    } catch (error) {
      console.error('Error displaying restaurant details:', error);
      document.getElementById('error-message').style.display = 'block';
      document.getElementById('error-message').textContent = 
        'Failed to load restaurant details. Please try again.';
    } finally {
      document.getElementById('loading-indicator').style.display = 'none';
    }
  },
};

export default Detail;
