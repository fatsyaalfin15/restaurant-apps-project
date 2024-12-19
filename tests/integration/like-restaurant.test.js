describe('Liking a Restaurant', () => {
  
  const mockDatabase = {
    restaurants: [],
    async add(restaurant) {
      this.restaurants.push(restaurant);
      return restaurant;
    },
    async delete(id) {
      this.restaurants = this.restaurants.filter(restaurant => restaurant.id !== id);
    },
    async getAll() {
      return [...this.restaurants];
    },
    async getById(id) {
      return this.restaurants.find(restaurant => restaurant.id === id);
    }
  };

  // Melakukan reset database sebelum setiap tes
  beforeEach(() => {
    mockDatabase.restaurants = [];
  });

  // Mock restoran untuk testing
  const sampleRestaurant = {
    id: '1',
    name: 'Test Restaurant',
    rating: 4.5,
    description: 'A delightful restaurant'
  };

  test('should be able to like a restaurant', async () => {
    // Tambahkan restoran
    await mockDatabase.add(sampleRestaurant);
    
    // Ambil daftar restoran
    const restaurants = await mockDatabase.getAll();
    
    // Verifikasi restoran ditambahkan
    expect(restaurants).toContainEqual(sampleRestaurant);
    expect(restaurants.length).toBe(1);
  });

  test('should be able to unlike a restaurant', async () => {
    // Tambahkan restoran
    await mockDatabase.add(sampleRestaurant);
    
    // Hapus restoran
    await mockDatabase.delete(sampleRestaurant.id);
    
    // Ambil daftar restoran
    const restaurants = await mockDatabase.getAll();
    
    // Verifikasi restoran dihapus
    expect(restaurants.length).toBe(0);
    expect(restaurants).toEqual([]);
  });

  test('should retrieve a restaurant by its id', async () => {
    // Tambahkan restoran
    await mockDatabase.add(sampleRestaurant);
    
    // Ambil restoran berdasarkan ID
    const restaurant = await mockDatabase.getById(sampleRestaurant.id);
    
    // Verifikasi restoran ditemukan
    expect(restaurant).toEqual(sampleRestaurant);
  });

  test('should not find a restaurant after it is deleted', async () => {
    // Tambahkan restoran
    await mockDatabase.add(sampleRestaurant);
    
    // Hapus restoran
    await mockDatabase.delete(sampleRestaurant.id);
    
    // Coba ambil restoran yang sudah dihapus
    const restaurant = await mockDatabase.getById(sampleRestaurant.id);
    
    // Verifikasi restoran tidak ditemukan
    expect(restaurant).toBeUndefined();
  });
});