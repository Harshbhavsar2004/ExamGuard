import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Context from './components/Context/Context.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/Context/ThemeProvider.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Context>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
    </Context>
  </StrictMode>,
);
