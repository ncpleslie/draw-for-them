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
import UserService from "../services/user.service";

export default function Login() {
  const { user } = useSnapshot(store);
  const navigate = useNavigate();

  const redirectIfUser = async (): Promise<void> => {
    if (user) {
      const userDetail = await UserService.getCurrentUserDetail();

      if (userDetail.friendIds.length === 0) {
        navigate({ pathname: "/add_friends" });

        return;
      }

      navigate({ pathname: "/" });

      return;
    }
  };

  useEffect(() => {
    (async () => await redirectIfUser())();
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
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
        },
      ],
    };

    ui.start("#firebaseui-auth-container", uiConfig);
  }, []);

  return (
    <div>
      <div id="firebaseui-auth-container"></div>
      <div id="loader" className="flex h-[100vh] items-center justify-center">
        <LoadingIndicator />
      </div>
    </div>
  );
}
