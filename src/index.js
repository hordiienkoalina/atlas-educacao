import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Get the root container element from the HTML
const container = document.getElementById('root');

// Create a React root and render the App component into it
const root = createRoot(container); // Create a root with the container element
root.render(<App />);