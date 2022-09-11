import React, { useState } from "react";
import { LoginFormId } from "../../enums/login-form-id.enum";
import FormSubmitData from "../../models/form-submit-data.model";
import Btn from "../UI/Btn";
import FocusableInput from "../UI/FocusableInput";

interface LoginSignUpProps {
  isSignUp?: boolean;
  onSubmit: (formData: FormSubmitData) => void;
}

const LoginSignUp: React.FC<LoginSignUpProps> = ({ isSignUp, onSubmit }) => {
  const [form, setForm] = useState({
    [LoginFormId.Email]: "",
    [LoginFormId.DisplayName]: "",
    [LoginFormId.Password]: "",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(
      new FormSubmitData(
        form[LoginFormId.Email],
        form[LoginFormId.Password],
        form[LoginFormId.DisplayName]
      )
    );
  };

  const handleFormUpdate = (id: LoginFormId, e: React.ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setForm((prev) => {
      prev[id] = value;
      return prev;
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-4 mt-4 flex h-[250px] flex-col items-center justify-center gap-4"
    >
      <FocusableInput
        type={"email"}
        id={LoginFormId.Email}
        placeholder={"Email"}
        value={form[LoginFormId.Email]}
        required
        onChange={(e) => handleFormUpdate(LoginFormId.Email, e)}
      />

      {isSignUp && (
        <FocusableInput
          type={"text"}
          id={LoginFormId.DisplayName}
          placeholder={"Display Name"}
          value={form[LoginFormId.DisplayName]}
          required
          onChange={(e) => handleFormUpdate(LoginFormId.DisplayName, e)}
        />
      )}

      <FocusableInput
        type={"password"}
        id={LoginFormId.Password}
        placeholder={"Password"}
        value={form[LoginFormId.Password]}
        required
        onChange={(e) => handleFormUpdate(LoginFormId.Password, e)}
      />

      <Btn type="submit" className="pt-0" onClicked={() => {}}>
        {isSignUp ? "Sign up" : "Login"}
      </Btn>
    </form>
  );
};

export default LoginSignUp;
