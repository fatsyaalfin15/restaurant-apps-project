/** @type {import('jest').Config} */
const config = {
  // Pola file yang akan dianggap sebagai pengujian
  testMatch: ['**/tests/**/*.test.[jt]s?(x)'],

  // File setup untuk lingkungan pengujian
  setupFiles: ['fake-indexeddb/auto'],

  // Lingkungan pengujian yang digunakan
  testEnvironment: 'jsdom',

  // Transformasi untuk mendukung ES6+ atau TypeScript
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },

  // Direktori untuk menyimpan cache Jest
  cacheDirectory: '.jest-cache',

  // Konfigurasi cakupan kode
  collectCoverage: true,
  collectCoverageFrom: [
    'src/scripts/**/*.{js,ts}', // Semua file di dalam src/scripts
    '!src/scripts/main.js', // Kecuali main.js
    '!src/scripts/ReviewForm.js', // Kecuali ReviewForm.js
    '!src/scripts/router.js', // Kecuali router.js
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text-summary'],

  // Output log yang lebih detail
  verbose: true,

  // Pemetaan modul untuk mengatasi alias dalam proyek
  moduleNameMapper: {
    '^@scripts/(.*)$': '<rootDir>/src/scripts/$1',
    '^@utils/(.*)$': '<rootDir>/src/scripts/utils/$1',
    '^@data/(.*)$': '<rootDir>/src/public/data/$1',
  },

  // Ekstensi file yang dapat diimpor secara eksplisit
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
};

module.exports = config;
