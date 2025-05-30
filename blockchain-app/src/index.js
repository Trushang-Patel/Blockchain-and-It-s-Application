import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import polyfills first
import './polyfills';



// Create a root using the new React 18 API
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);