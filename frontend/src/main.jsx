// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



// src/index.js (or src/index.jsx)

// Import React (not always needed in React 17+, but good for clarity)
import React from "react";
import { createRoot } from "react-dom/client";

// Import your main App component
import App from "./App";

// Import global styles (this is correct – relative path)
import "./index.css";

// Optional: StrictMode helps catch bugs in development
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error("Root element not found: #root");
}
