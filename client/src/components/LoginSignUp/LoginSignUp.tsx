import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import FormSubmitData from "../../models/form-submit-data.model";
import Btn from "../UI/Btn";
import FocusableInput from "../UI/FocusableInput";

interface LoginSignUpProps {
  isSignUp?: boolean;
  onSubmit: (formData: FormSubmitData) => void;
}

const LoginSignUp: React.FC<LoginSignUpProps> = ({ isSignUp, onSubmit }) => {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [displayNameInputValue, setDisplayNameInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [displayNameFocused, setDisplayNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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

  const handleOnInputChange = (e: ChangeEvent) => {
    const input = e.nativeEvent as InputEvent;
    const key = input.data as string;

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
    if (!key) {
      inputState((prev: string) => prev.slice(0, -1));

      return;
    }

    inputState((prev: string) => (prev += key));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      (!displayNameInputValue && isSignUp) ||
      !emailInputValue ||
      !passwordInputValue
    ) {
      return;
    }

    onSubmit(
      new FormSubmitData(
        emailInputValue,
        passwordInputValue,
        displayNameInputValue
      )
    );
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-4 mt-4 flex h-[250px] flex-col items-center justify-center gap-4"
    >
      <FocusableInput
        type={"email"}
        id={"email-input"}
        placeholder={"Email"}
        onChange={handleOnInputChange}
        onFocus={onEmailFocus}
      />

      {isSignUp && (
        <FocusableInput
          type={"text"}
          id={"display-name-input"}
          placeholder={"Display Name"}
          onChange={handleOnInputChange}
          onFocus={onDisplayNameFocus}
        />
      )}

      <FocusableInput
        type={"password"}
        id={"password-input"}
        placeholder={"Password"}
        onChange={handleOnInputChange}
        onFocus={onPasswordFocus}
      />

      <Btn type="submit" className="pt-0" onClicked={() => {}}>
        {isSignUp ? "Sign up" : "Login"}
      </Btn>
    </form>
  );
};

export default LoginSignUp;
