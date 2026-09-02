import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const viteMeta = import.meta as ImportMeta & { env?: { PROD?: boolean } };

if ('serviceWorker' in navigator && viteMeta.env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((error) => {
      console.warn('PWA service worker registration failed:', error);
    });
  });
}

// Ensure window.fetch is configurable with a setter in strict mode environments
try {
  if (typeof window !== 'undefined') {
    let currentFetch = window.fetch.bind(window);
    Object.defineProperty(window, 'fetch', {
      get() {
        return currentFetch;
      },
      set(fn) {
        currentFetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch (e) {
  // Ignored if already defined or restricted
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
