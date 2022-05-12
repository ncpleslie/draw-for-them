import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";
import { useEffect } from "react";
import { compatApp } from "../api/firebase.config";
import "firebaseui/dist/firebaseui.css";
import { useSnapshot } from "valtio";
import { store } from "../store/store";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/UI/LoadingIndicator";

export default function Login() {
  const { user } = useSnapshot(store);
  const navigate = useNavigate();

  const redirectIfUser = (): void => {
    if (user) {
      navigate({ pathname: "/" });

      return;
    }
  };

  useEffect(() => {
    redirectIfUser();
  }, [user]);

  useEffect(() => {
    redirectIfUser();

    const ui = new firebaseui.auth.AuthUI(compatApp.auth());

    const uiConfig = {
      callbacks: {
        uiShown: function () {
          document.getElementById("loader")!.style.display = "none";
        },
      },
      signInFlow: "popup",
      signInSuccessUrl: "/",
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    };

    ui.start("#firebaseui-auth-container", uiConfig);
  }, []);

  return (
    <div>
      <div id="firebaseui-auth-container"></div>
      <div id="loader" className="flex justify-center items-center h-[100vh]">
        <LoadingIndicator />
      </div>
    </div>
  );
}
