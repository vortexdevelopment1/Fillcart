import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ToastProvider } from './context/ToastContext';
import { VerificationProvider } from './context/VerificationContext';
import { AppProvider } from './context/AppContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <VerificationProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </VerificationProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
