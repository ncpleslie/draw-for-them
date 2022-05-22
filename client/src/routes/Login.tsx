import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { store } from "../store/store";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import UserService from "../services/user.service";
import Keyboard from "../components/Keyboard/Keyboard";
import { Tab } from "@headlessui/react";
import Btn from "../components/UI/Btn";
import { classNames } from "../utils/helper.utils";
import { KeyboardSpecialKey } from "../enums/keyboard-special-key.enum";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [tabSections] = useState(["Sign Up", "Login"]);
  const [emailInputValue, setEmailInputValue] = useState("");
  const [displayNameInputValue, setDisplayNameInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [displayNameFocused, setDisplayNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
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

  const onEmailFocus = () => {
    setEmailFocused(true);
    setDisplayNameFocused(false);
    setPasswordFocused(false);
  };
  const onDisplayNameFocus = () => {
    setEmailFocused(false);
    setDisplayNameFocused(true);
    setPasswordFocused(false);
  };
  const onPasswordFocus = () => {
    setEmailFocused(false);
    setDisplayNameFocused(false);
    setPasswordFocused(true);
  };

  const handleKeyboardKeyEntered = (key: string) => {
    if (emailFocused) {
      updateInputValue(key, setEmailInputValue);
    }

    if (displayNameFocused) {
      updateInputValue(key, setDisplayNameInputValue);
    }

    if (passwordFocused) {
      updateInputValue(key, setPasswordInputValue);
    }
  };

  const updateInputValue = (
    key: string,
    inputState: Dispatch<SetStateAction<string>>
  ): void => {
    if (key === KeyboardSpecialKey.Delete) {
      inputState((prev: string) => prev.slice(0, -1));

      return;
    }

    inputState((prev: string) => (prev += key));
  };

  const handleSignUp = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!displayNameInputValue || !emailInputValue || !passwordInputValue) {
      return;
    }

    try {
      setLoading(true);
      await UserService.signUp(
        displayNameInputValue,
        emailInputValue,
        passwordInputValue
      );
    } catch (e) {
      setLoading(false);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!emailInputValue || !passwordInputValue) {
      return;
    }

    try {
      setLoading(true);
      await UserService.login(emailInputValue, passwordInputValue);
    } catch (e) {
      setLoading(false);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="app-container flex h-[100vh] w-full flex-row items-center justify-center gap-10">
        <div className="neu-container-raised w-72 rounded-xl p-4 ">
          <Tab.Group>
            <Tab.List className="neu-container-raised flex space-x-1 rounded-xl p-1">
              {tabSections.map((section) => (
                <Tab
                  key={section}
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5 ",
                      "ring-icon-active ring-opacity-60 ring-offset-2 ring-offset-icon-active focus:outline-none ",
                      selected
                        ? "text-icon-active"
                        : "neu-container-depressed text-icon-inactive"
                    )
                  }
                >
                  {section}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <form
                  onSubmit={handleSignUp}
                  className="mx-4 mt-4 flex h-[250px] flex-col items-center justify-center gap-4"
                >
                  <div className="flex w-full flex-col">
                    <input
                      className="neu-container rounded-xl px-3 py-2 text-icon-hover focus:border-icon-active focus:outline-none"
                      type="email"
                      id="email-input"
                      value={emailInputValue}
                      onFocus={onEmailFocus}
                      placeholder="Email"
                      readOnly
                    />
                  </div>
                  <div className="flex w-full flex-col">
                    <input
                      className="neu-container rounded-xl px-3 py-2 text-icon-hover focus:border-icon-active focus:outline-none"
                      type="text"
                      id="display-name-input"
                      value={displayNameInputValue}
                      onFocus={onDisplayNameFocus}
                      placeholder="Display Name"
                      readOnly
                    />
                  </div>
                  <div className="flex w-full flex-col">
                    <input
                      className="neu-container rounded-xl px-3 py-2 text-icon-hover focus:border-icon-active focus:outline-none"
                      type="password"
                      id="password-input"
                      value={passwordInputValue}
                      onFocus={onPasswordFocus}
                      placeholder="Password"
                      readOnly
                    />
                  </div>
                  <Btn type="submit" onClicked={() => {}}>
                    Sign Up
                  </Btn>
                </form>
              </Tab.Panel>
              <Tab.Panel>
                {" "}
                <form
                  onSubmit={handleLogin}
                  className="mx-4 mt-4 flex h-[250px] flex-col items-center justify-center gap-4"
                >
                  <div className="flex w-full flex-col">
                    <input
                      className="neu-container rounded-xl px-3 py-2 text-icon-hover focus:border-icon-active focus:outline-none"
                      type="email"
                      id="email-input"
                      value={emailInputValue}
                      onFocus={onEmailFocus}
                      placeholder="Email"
                      readOnly
                    />
                  </div>
                  <div className="flex w-full flex-col">
                    <input
                      className="neu-container rounded-xl px-3 py-2 text-icon-hover focus:border-icon-active focus:outline-none"
                      type="password"
                      id="password-input"
                      value={passwordInputValue}
                      onFocus={onPasswordFocus}
                      placeholder="Password"
                      readOnly
                    />
                  </div>
                  <Btn type="submit" onClicked={() => {}}>
                    Login
                  </Btn>
                </form>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        <div className="neu-container-raised w-[400px] rounded-xl">
          <Keyboard onKeyEntered={handleKeyboardKeyEntered} />
        </div>
      </div>
      {loading && (
        <div id="loader" className="flex h-[100vh] items-center justify-center">
          <LoadingIndicator />
        </div>
      )}
    </>
  );
}
