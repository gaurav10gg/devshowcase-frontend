import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import ThemeModeProvider from "./context/ThemeContext";   // ⭐ Add this

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={client}>
      <ThemeModeProvider>     {/* ⭐ Wrap App here */}
        <App />
      </ThemeModeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);


