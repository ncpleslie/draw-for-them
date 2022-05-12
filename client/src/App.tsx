import { BrowserRouter, Routes, Route } from "react-router-dom";
import Draw from "./routes/Draw";
import Login from "./routes/Login";
import View from "./routes/View";
import UserEventService from "./services/user-event.service";
import Toast from "./components/UI/Toast";
import UserService from "./services/user.service";
import RequireAuth from "./components/Auth/RequireAuth";
import { useEffect, useState } from "react";
import Root from "./routes/Root";
import LoadingIndicator from "./components/UI/LoadingIndicator";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await UserService.getAndPersistCurrentUser();
        UserService.listenToAuthChange();
        UserEventService.start();
      } catch (e) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Root />
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
}
