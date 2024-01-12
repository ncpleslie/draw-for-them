import type { InferGetServerSidePropsType, NextPage } from "next";
import type { CtxOrReq } from "next-auth/client/_utils";
import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
} from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import EmailLogin from "../components/signin/EmailLogin";
import { VerificationStep } from "../components/signin/VerificationStep";
import Btn from "../components/ui/Btn";
import { Routes } from "../enums/routes.enum";
import UnauthAppShell from "../layout/UnauthAppShell";
import type EmailSignUpFormData from "../models/email-signup-form-data.model";

export async function getServerSideProps(context: CtxOrReq | undefined) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: Routes.Root,
        permanent: false,
      },
    };
  }

  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: { providers, csrfToken, host: context?.req?.headers.host },
  };
}

const SignIn: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers, csrfToken, host }) => {
  return (
    <UnauthAppShell>
      <Head>
        <title>Draw For Them | Sign In</title>
      </Head>
      <div className="app-container flex h-full w-full flex-col items-center justify-center gap-10">
        <div className="neu-container-raised flex w-72 flex-col items-center justify-center rounded-xl p-4 text-center">
          <h1>Draw For Them</h1>
          <p>The ephemeral drawing application</p>
        </div>
        {providers?.email && csrfToken && host && (
          <EmailLoginSection csrfToken={csrfToken} host={host} />
        )}
      </div>
    </UnauthAppShell>
  );
};

interface EmailLoginSectionProps {
  csrfToken: string;
  host: string;
}

const EmailLoginSection: React.FC<EmailLoginSectionProps> = ({
  csrfToken,
  host,
}) => {
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [email, setEmail] = useState("");
  const handleEmailSubmit = async (emailFormData: EmailSignUpFormData) => {
    setEmail(emailFormData.email);
    await signIn("email", { email: emailFormData.email, redirect: false });
    setShowVerificationStep(true);
  };

  return (
    <div className="neu-container-raised flex w-72 flex-col items-center justify-center rounded-xl p-4">
      {!showVerificationStep && (
        <EmailLogin csrfToken={csrfToken} onSubmit={handleEmailSubmit} />
      )}
      {showVerificationStep && (
        <VerificationStep email={email} callbackUrl={`https://${host}`} />
      )}
    </div>
  );
};

export default SignIn;
