import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './theme.css';
import { ErrorBoundary } from './components/ui/error-boundary';

try {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found");
  }

  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  console.log("Application rendered successfully");
} catch (error) {
  console.error("Error rendering application:", error);

  // Display error on the page
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
        <h2>Error Loading Application</h2>
        <p>${error instanceof Error ? error.message : String(error)}</p>
        <p>Please check the browser console for more details.</p>
      </div>
    `;
  }
}