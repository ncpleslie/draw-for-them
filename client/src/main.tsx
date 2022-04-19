import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Draw from "./routes/Draw";
import View from "./routes/View";
import Header from "./components/Header/Header";
import UserEventService from "./services/user-event.service";

UserEventService.start();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/draw" element={<Draw />} />
      <Route path="/view" element={<View />} />
    </Routes>
  </BrowserRouter>
);
