import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// import App from './App';

const rootElement = document.getElementById('react-root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <p>Hello World, React!</p>
  </StrictMode>
);
