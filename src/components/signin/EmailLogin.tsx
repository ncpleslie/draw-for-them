import React, { useState } from "react";
import { SignUpFormId } from "../../enums/signup-form-id.enum";
import EmailSignUpFormData from "../../models/email-signup-form-data.model";
import Btn from "../ui/Btn";
import FocusableInput from "../ui/FocusableInput";

interface EmailLoginProps {
  csrfToken?: string;
  onSubmit: (formData: EmailSignUpFormData) => Promise<void>;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ csrfToken, onSubmit }) => {
  const [form, setForm] = useState({
    [SignUpFormId.Email]: "",
  });
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(new EmailSignUpFormData(form[SignUpFormId.Email]));
    setLoading(false);
  };

  const handleFormUpdate = (id: SignUpFormId, e: React.ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setForm((prev) => {
      prev[id] = value;
      return prev;
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-4 mt-4 flex flex-col items-center justify-between gap-4"
    >
      <div className="flex h-full flex-col justify-center gap-4">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <FocusableInput
          type={"email"}
          id={SignUpFormId.Email}
          placeholder={"Email"}
          name={SignUpFormId.Email}
          required
          onChange={(e) => handleFormUpdate(SignUpFormId.Email, e)}
        />
      </div>
      <div className="flex flex-row gap-8">
        <Btn type="submit" loading={loading}>
          <p className="text-xl">Sign Up</p>
        </Btn>

        <Btn type="submit" loading={loading}>
          <p className="text-xl">Sign In</p>
        </Btn>
      </div>
    </form>
  );
};

export default EmailLogin;
