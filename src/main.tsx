// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { AuthProvider } from "./contexts/AuthContext";
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
            color: '#fff',
            border: '1px solid #2a5298',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
        }}
      />
      <App />
    </AuthProvider>
  </StrictMode>
);