import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";

// Redux
import { Provider } from "react-redux";
import { store } from "./redux/store";

// ✅ ADD THIS
import axios from "axios";
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <Toaster />
  </StrictMode>
);
