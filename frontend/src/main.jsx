import ErrorBoundary from "./ErrorBoundary.jsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'leaflet/dist/leaflet.css';

import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./context/Context.jsx";
import { Analytics } from '@vercel/analytics/next';

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <ErrorBoundary>
    <ContextProvider>
      <App />
      <Analytics />
    </ContextProvider>

  </ErrorBoundary>
    
  </BrowserRouter>
);
