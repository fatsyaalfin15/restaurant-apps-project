import { openDB } from 'idb';
import { navigateTo } from './router.js';
import { Workbox } from 'workbox-window';


const swRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in the browser');
    return;
  }
  const wb = new Workbox('./sw.bundle.js');
  try {
    await wb.register();
    console.log('Service worker registered');
  } catch (error) {
    console.log('Failed to register service worker', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const closeBtn = document.querySelector('.close-btn');
  const loadingIndicator = document.createElement('div');
  loadingIndicator.classList.add('loading-indicator');
  document.body.appendChild(loadingIndicator);

  function showLoading(message) {
    loadingIndicator.innerHTML = `
      <div class="loading-content">
        <span class="close-btn">&times;</span>
        <p>${message}</p>
      </div>
    `;
    loadingIndicator.style.display = 'block';

    document.querySelector('.loading-content .close-btn').addEventListener('click', () => {
      loadingIndicator.style.display = 'none';
    });
  }

  function hideLoading() {
    loadingIndicator.style.display = 'none';
  }

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('open');
    navMenu.style.transform = expanded ? 'translateX(100%)' : 'translateX(0)';
  });

  closeBtn.addEventListener('click', () => {
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.style.transform = 'translateX(100%)';
    navMenu.setAttribute('aria-hidden', 'true');
  });


  function showSection(sectionId) {
    document.getElementById('restaurant-list').style.display = 'none';
    document.getElementById('restaurant-detail').style.display = 'none';
    document.getElementById('favorite-list').style.display = 'none';

    const section = document.getElementById(sectionId);
    section.style.display = 'block';


    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('content').focus();
  }
  window.showSection = showSection;

  async function initDB() {
    return openDB('restaurant-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('favorites')) {
          db.createObjectStore('favorites', { keyPath: 'id' });
        }
      },
    });
  }

  async function addFavorite(restaurant) {
    const db = await initDB();
    await db.put('favorites', restaurant);
  }

  async function removeFavorite(restaurantId) {
    const db = await initDB();
    await db.delete('favorites', restaurantId);
  }

  async function checkIfFavorite(restaurantId) {
    const db = await initDB();
    return !!(await db.get('favorites', restaurantId));
  }

  async function getFavorites() {
    const db = await initDB();
    return await db.getAll('favorites');
  }

  async function fetchRestaurants() {
    try {
      showLoading('Loading restaurants...');
      const response = await fetch('https://restaurant-api.dicoding.dev/list');
      if (!response.ok) throw new Error('Failed to fetch restaurants.');
      const data = await response.json();

      displayRestaurants(data.restaurants);
      hideLoading();
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      const cachedRestaurants = await getFavorites();
      if (cachedRestaurants.length > 0) {
        displayRestaurants(cachedRestaurants);
        showLoading('Displaying cached favorites.');
      } else {
        showLoading('Failed to load data. Please try again.');
      }
    }
  }

  function displayRestaurants(restaurants) {
    const restaurantListContent = document.getElementById('restaurant-list-content');
    restaurantListContent.innerHTML = restaurants.map((restaurant) => `
      <article class="restaurant-card" tabindex="0">
        <img data-src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}" class="lazyload">
        <h3>${restaurant.name}</h3>
        <p>City: ${restaurant.city}</p>
        <p>Rating: ${restaurant.rating}</p>
        <a href="#details=${restaurant.id}" class="cta" onclick="displayRestaurantDetails('${restaurant.id}'); showSection('restaurant-detail')">View Details</a>
      </article>
    `).join('');
  }

  async function displayRestaurantDetails(restaurantId) {
    try {
      showLoading('Loading details...');
      const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${restaurantId}`);
      if (!response.ok) throw new Error('Failed to load details.');
      const { restaurant } = await response.json();

      const restaurantDetailContainer = document.getElementById('restaurant-detail');
      restaurantDetailContainer.querySelector('#restaurant-name').innerText = restaurant.name;
      restaurantDetailContainer.querySelector('#restaurant-image').src = `https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}`;
      restaurantDetailContainer.querySelector('#restaurant-address').innerText = restaurant.address;
      restaurantDetailContainer.querySelector('#restaurant-city').innerText = restaurant.city;
      restaurantDetailContainer.querySelector('#restaurant-description').innerText = restaurant.description;
      restaurantDetailContainer.querySelector('#restaurant-menu-food').innerText = restaurant.menus.foods.map((food) => food.name).join(', ');
      restaurantDetailContainer.querySelector('#restaurant-menu-drink').innerText = restaurant.menus.drinks.map((drink) => drink.name).join(', ');

      const reviewsList = restaurantDetailContainer.querySelector('#reviews-list');
      reviewsList.innerHTML = restaurant.customerReviews.map((review) => `
        <li>
          <p><strong>${review.name}</strong> (${review.date}):</p>
          <p>${review.review}</p>
        </li>
      `).join('');

      const favoriteButton = document.getElementById('favorite-button');
      let isFavorite = await checkIfFavorite(restaurantId);
      favoriteButton.innerText = isFavorite ? 'Remove from Favorite' : 'Add to Favorite';

      favoriteButton.onclick = async () => {
        if (isFavorite) {
          await removeFavorite(restaurantId);
          favoriteButton.innerText = 'Add to Favorite';
        } else {
          await addFavorite(restaurant); // Fungsi digunakan di sini
          favoriteButton.innerText = 'Remove from Favorite';
        }
        isFavorite = !isFavorite;
      };

      hideLoading();
      showSection('restaurant-detail');
    } catch (error) {
      showLoading('Failed to load details. Please try again.');
      console.error('Error displaying restaurant details:', error);
    }
  }

  async function displayFavoriteRestaurants() {
    try {
      showLoading('Loading favorites...');
      const favorites = await getFavorites();
      const favoriteListContent = document.getElementById('favorite-list-content');

      if (favorites.length === 0) {
        favoriteListContent.innerHTML = '<p>No favorite restaurants added yet.</p>';
      } else {
        favoriteListContent.innerHTML = favorites.map((restaurant) => `
          <article class="restaurant-card">
            <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}">
            <h3>${restaurant.name}</h3>
            <p>City: ${restaurant.city}</p>
            <p>Rating: ${restaurant.rating}</p>
            <a href="#details=${restaurant.id}" class="cta" onclick="displayRestaurantDetails('${restaurant.id}'); showSection('restaurant-detail')">View Details</a>
          </article>
        `).join('');
      }
      hideLoading();
      showSection('favorite-list');
    } catch (error) {
      showLoading('Failed to load favorites. Please try again.');
      console.error('Error displaying favorite restaurants:', error);
    }
  }

  window.addEventListener('load', () => {
    const currentHash = window.location.hash || '#home';
    if (currentHash.startsWith('#details=')) {
      displayRestaurantDetails(currentHash.split('=')[1]);
    } else {
      navigateTo(currentHash);
    }
    swRegister();
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#details=')) {
      displayRestaurantDetails(hash.split('=')[1]);
    } else {
      navigateTo(hash);
    }
    const skipLinkElem = document.querySelector('.skip-link');
    skipLinkElem.addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelector('#content').scrollIntoView();
      skipLinkElem.blur();
    });
  });

  fetchRestaurants();

  window.displayRestaurantDetails = displayRestaurantDetails;
  window.displayFavoriteRestaurants = displayFavoriteRestaurants;
  window.fetchRestaurants = fetchRestaurants;
});