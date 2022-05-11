import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";
import { useEffect } from "react";
import { compatApp } from "../api/firebase.config";
import "firebaseui/dist/firebaseui.css";
import { useSnapshot } from "valtio";
import { store } from "../store/store";
import { useNavigate } from "react-router-dom";

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
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById("loader").style.display = "none";
        },
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: "popup",
      signInSuccessUrl: "/",
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      // Terms of service url.
      tosUrl: "<your-tos-url>",
      // Privacy policy url.
      privacyPolicyUrl: "<your-privacy-policy-url>",
    };

    ui.start("#firebaseui-auth-container", uiConfig);
  }, []);

  return (
    <div>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </div>
  );
}
