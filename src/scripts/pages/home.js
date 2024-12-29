const Home = {
    async render() {
      return `
        <section class="restaurant-list">
          <h2>Explore Restaurants</h2>
          <div id="restaurant-list-content"></div>
        </section>
      `;
    },
  
    async afterRender() {
      try {
        const response = await fetch('https://restaurant-api.dicoding.dev/list');
        const data = await response.json();
        const restaurantListContent = document.getElementById('restaurant-list-content');
        restaurantListContent.innerHTML = data.restaurants
          .map(
            (restaurant) => `
            <article class="restaurant-card">
              <img data-src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}" class="lazyload">
              <h3>${restaurant.name}</h3>
              <p>City: ${restaurant.city}</p>
              <p>Rating: ${restaurant.rating}</p>
              <a href="#/detail/${restaurant.id}" class="cta">View Details</a>
            </article>
          `
          )
          .join('');
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    },
  };
  
  export default Home;