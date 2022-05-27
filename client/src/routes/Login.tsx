import { useState } from "react";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import UserService from "../services/user.service";
import { Tab } from "@headlessui/react";
import TabBtn from "../components/UI/TabBtn";
import LoginSignUp from "../components/LoginSignUp/LoginSignUp";
import FormSubmitData from "../models/form-submit-data.model";
import { useHasNoFriends } from "../hooks/use-has-no-friends.hook";
import ToastService from "../services/toast.service";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { loadingHasNoFriends } = useHasNoFriends();

  const handleSignUp = async (formData: FormSubmitData): Promise<void> => {
    if (!formData.displayName) {
      return;
    }

    try {
      setLoading(true);
      await UserService.signUp(
        formData.displayName,
        formData.email,
        formData.password
      );
    } catch (e) {
      setLoading(false);
      ToastService.showErrorToast(
        "Something went wrong trying to sign you up. Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (formData: FormSubmitData): Promise<void> => {
    try {
      setLoading(true);
      await UserService.login(formData.email, formData.password);
    } catch (e) {
      setLoading(false);
      ToastService.showErrorToast(
        "Something went wrong trying to log you in. Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingHasNoFriends) {
    return (
      <div id="loader" className="flex h-[100vh] items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="app-container flex h-[100vh] w-full flex-row items-center justify-center gap-10">
      <div className="neu-container-raised flex w-72 flex-col items-center justify-center rounded-xl p-4">
        <Tab.Group>
          <Tab.List className="neu-container-raised flex w-full space-x-1 rounded-xl p-1">
            {["Sign Up", "Login"].map((section) => (
              <TabBtn key={section}>{section}</TabBtn>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <LoginSignUp isSignUp onSubmit={handleSignUp} />
            </Tab.Panel>
            <Tab.Panel>
              <LoginSignUp onSubmit={handleLogin} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
