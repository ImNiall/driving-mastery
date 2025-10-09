import { createRoot } from "react-dom/client";
import App from "./App";
import AuthProvider from "./src/providers/AuthProvider";

const el = document.getElementById("root");
if (!el) throw new Error("#root not found");

createRoot(el).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
);
