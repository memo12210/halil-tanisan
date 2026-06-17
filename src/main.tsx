import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { theme } from './config/theme';
import './styles/global.css';

const root = document.documentElement;
root.style.setProperty('--rest-dim', String(theme.restDim));
root.style.setProperty('--accent', theme.accent);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
