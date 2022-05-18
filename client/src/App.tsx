import { Routes, Route, HashRouter } from "react-router-dom";
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
import AddFriends from "./routes/AddFriends";

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
        console.error(e);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <HashRouter>
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
        <Route
          path="/add_friends"
          element={
            <RequireAuth>
              <AddFriends />
            </RequireAuth>
          }
        />
      </Routes>
    </HashRouter>
  );
}
