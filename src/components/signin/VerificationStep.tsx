import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import Btn from "../ui/Btn";
import FocusableInput from "../ui/FocusableInput";

interface VerificationStepProps {
  email: string;
  callbackUrl?: string;
}

/**
 * User has inserted the email and now he can put in the verification code
 */
export const VerificationStep: React.FC<VerificationStepProps> = ({
  email,
  callbackUrl,
}) => {
  const router = useRouter();
  const [code, setCode] = useState("");

  const onReady = (e: React.FormEvent) => {
    e.preventDefault();
    useCallback(() => {
      router.replace(
        `/api/auth/callback/email?email=${encodeURIComponent(
          email
        )}&token=${code}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ""}`
      );
    }, [callbackUrl, code, email]);
  };

  const handleFormUpdate = (e: React.ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setCode(value);
  };

  return (
    <form
      onSubmit={onReady}
      className="mx-4 mt-4 flex flex-col items-center justify-between gap-4"
    >
      <h2 className="text-center text-lg">
        Insert the magic code you received in your email
      </h2>

      <FocusableInput
        id="magic-code"
        type="text"
        placeholder="e.g. 123456"
        onChange={(e) => handleFormUpdate(e)}
      />

      <Btn type="submit">
        <p className="text-xl">Continue</p>
      </Btn>
    </form>
  );
};
