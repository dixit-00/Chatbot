import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AppContextProvider } from "./Context/AppContext.jsx";
import ErrorBoundary from "./Context/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AppContextProvider>
  </BrowserRouter>
);
