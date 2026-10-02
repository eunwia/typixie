import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TypixieProvider } from './context/TypixieContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TypixieProvider>
      <App />
    </TypixieProvider>
  </React.StrictMode>
);
