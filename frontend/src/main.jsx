
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/inter/900.css'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
