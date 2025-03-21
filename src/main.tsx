import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initializeKeycloak } from "./keycloak";
import { NotificationProvider } from "./NotificationProvider.tsx";
import { ToastContainer } from "react-toastify";

const root = createRoot(document.getElementById("root")!);

initializeKeycloak().then(() => {
  root.render(
    <StrictMode>
      <NotificationProvider>
        <App />
        <ToastContainer />
      </NotificationProvider>
    </StrictMode>
  );
});

