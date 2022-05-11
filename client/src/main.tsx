import "./index.css";
import "./styles/style.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Draw from "./routes/Draw";
import Login from "./routes/Login";
import View from "./routes/View";
import UserEventService from "./services/user-event.service";
import Toast from "./components/UI/Toast";
import UserService from "./services/user.service";
import RequireAuth from "./components/Auth/RequireAuth";

UserService.listenToAuthChange();
UserEventService.start();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <Toast />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <App />
          </RequireAuth>
        }
      />
      <Route
        path="/draw"
        element={
          <RequireAuth>
            <Draw />
          </RequireAuth>
        }
      />
      <Route
        path="/view"
        element={
          <RequireAuth>
            <View />
          </RequireAuth>
        }
      />
    </Routes>
  </BrowserRouter>
);
