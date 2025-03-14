import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initializeKeycloak } from "./keycloak";

const root = createRoot(document.getElementById("root")!);

initializeKeycloak().then(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});

