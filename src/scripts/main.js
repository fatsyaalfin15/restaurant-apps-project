import routes from './routes.js';
import { Workbox } from 'workbox-window';

const router = async () => {
  const urlHash = window.location.hash.slice(1).toLowerCase();
  const urlParts = urlHash.split('/');
  let route = `/${urlParts[1] || ''}`; 
  
  if (urlParts[1] === 'detail') {
    route = '/detail/:id';
  }

  const page = routes[route] || routes['/'];
  const content = document.getElementById('content');
  
  try {
    document.getElementById('loading-indicator').style.display = 'block';
    content.innerHTML = await page.render();
    if (page.afterRender) await page.afterRender();
  } catch (error) {
    console.error('Error rendering page:', error);
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('error-message').textContent = 'Failed to load content. Please try again.';
  } finally {
    document.getElementById('loading-indicator').style.display = 'none';
  }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

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
    console.error('Failed to register service worker:', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  swRegister();
  
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const closeBtn = document.querySelector('.close-btn');
  const loadingIndicator = document.createElement('div');
  loadingIndicator.classList.add('loading-indicator');
  document.body.appendChild(loadingIndicator);

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

  const skipLinkElem = document.querySelector('.skip-link');
  skipLinkElem.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('#content').scrollIntoView({ behavior: 'smooth' });
    skipLinkElem.blur();
  });
});
