const routes = {
  '#home': {
    render: () => {
      document.getElementById('restaurant-list').style.display = 'block';
      document.getElementById('restaurant-detail').style.display = 'none';
      document.getElementById('favorite-list').style.display = 'none';
      window.fetchRestaurants();
      document.getElementById('content').focus();
    },
  },
  '#favorites': {
    render: () => {
      document.getElementById('restaurant-list').style.display = 'none';
      document.getElementById('restaurant-detail').style.display = 'none';
      document.getElementById('favorite-list').style.display = 'block';
      window.displayFavoriteRestaurants();
      document.getElementById('content').focus();
    },
  },


  '#details': {
    render: () => {
      document.getElementById('restaurant-list').style.display = 'none';
      document.getElementById('restaurant-detail').style.display = 'none';
      document.getElementById('favorite-list').style.display = 'block';
      window.displayRestaurantDetails();
      document.getElementById('content').focus();
    },
  },
};

function navigateTo(hash) {
  const route = routes[hash] || routes['#home'];
  if (route && typeof route.render === 'function') {
    route.render();
  }
}

export { navigateTo };
