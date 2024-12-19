import FavoriteRestaurantIdb from '@data/favorite-restaurant-idb';
import LikeButtonPresenter from '@utils/like-button-presenter';

describe('Liking A Restaurant', () => {
  const addLikeButtonContainer = () => {
    document.body.innerHTML = '<div id="favorite-button-container"></div>';
  };

  beforeEach(() => {
    addLikeButtonContainer();
  });

  it('should show the like button when the restaurant has not been liked before', async () => {
    await LikeButtonPresenter.init({
      favoriteButtonContainer: document.querySelector('#favorite-button-container'),
      restaurant: {
        id: 1,
        name: 'Test Restaurant'
      },
      favoriteRestaurants: FavoriteRestaurantIdb
    });

    expect(document.querySelector('[aria-label="Like this restaurant"]')).toBeTruthy();
  });

  it('should not show the unlike button when the restaurant has not been liked before', async () => {
    await LikeButtonPresenter.init({
      favoriteButtonContainer: document.querySelector('#favorite-button-container'),
      restaurant: {
        id: 1,
        name: 'Test Restaurant'
      },
      favoriteRestaurants: FavoriteRestaurantIdb
    });

    expect(document.querySelector('[aria-label="Unlike this restaurant"]')).toBeFalsy();
  });

  it('should be able to like the restaurant', async () => {
    await LikeButtonPresenter.init({
      favoriteButtonContainer: document.querySelector('#favorite-button-container'),
      restaurant: {
        id: 1,
        name: 'Test Restaurant'
      },
      favoriteRestaurants: FavoriteRestaurantIdb
    });

    document.querySelector('#favorite-button').dispatchEvent(new Event('click'));
    
    const restaurant = await FavoriteRestaurantIdb.getRestaurant(1);
    expect(restaurant).toEqual({ id: 1, name: 'Test Restaurant' });
  });

  it('should not add a restaurant again when its already liked', async () => {
    await LikeButtonPresenter.init({
      favoriteButtonContainer: document.querySelector('#favorite-button-container'),
      restaurant: {
        id: 1,
        name: 'Test Restaurant'
      },
      favoriteRestaurants: FavoriteRestaurantIdb
    });

    // Pertama, like restaurant
    await FavoriteRestaurantIdb.putRestaurant({ id: 1, name: 'Test Restaurant' });
    
    // Inisialisasi ulang presenter
    await LikeButtonPresenter.init({
      favoriteButtonContainer: document.querySelector('#favorite-button-container'),
      restaurant: {
        id: 1,
        name: 'Test Restaurant'
      },
      favoriteRestaurants: FavoriteRestaurantIdb
    });

    document.querySelector('#favorite-button').dispatchEvent(new Event('click'));
    
    const restaurants = await FavoriteRestaurantIdb.getAllRestaurants();
    expect(restaurants).toHaveLength(1);
  });

  it('should be able to unlike the restaurant', async () => {
    await LikeButtonPresenter.init({
      favoriteButtonContainer: document.querySelector('#favorite-button-container'),
      restaurant: {
        id: 1,
        name: 'Test Restaurant'
      },
      favoriteRestaurants: FavoriteRestaurantIdb
    });

    
    await FavoriteRestaurantIdb.putRestaurant({ id: 1, name: 'Test Restaurant' });
    
    await LikeButtonPresenter.init({
      favoriteButtonContainer: document.querySelector('#favorite-button-container'),
      restaurant: {
        id: 1,
        name: 'Test Restaurant'
      },
      favoriteRestaurants: FavoriteRestaurantIdb
    });

    document.querySelector('#favorite-button').dispatchEvent(new Event('click'));
    
    const restaurants = await FavoriteRestaurantIdb.getAllRestaurants();
    expect(restaurants).toHaveLength(0);
  });
});