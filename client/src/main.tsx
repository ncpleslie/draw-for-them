import "./index.css";
import "./styles/style.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Draw from "./routes/Draw";
import View from "./routes/View";
import UserEventService from "./services/user-event.service";
import Toast from "./components/UI/Toast";

UserEventService.start();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <Toast />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/draw" element={<Draw />} />
      <Route path="/view" element={<View />} />
    </Routes>
  </BrowserRouter>
);
