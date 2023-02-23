import { InferGetServerSidePropsType, NextPage } from "next";
import { CtxOrReq } from "next-auth/client/_utils";
import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
} from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import EmailLogin from "../components/signin/EmailLogin";
import { VerificationStep } from "../components/signin/VerificationStep";
import Btn from "../components/ui/Btn";
import { Routes } from "../enums/routes.enum";
import UnauthAppShell from "../layout/UnauthAppShell";
import EmailSignUpFormData from "../models/email-signup-form-data.model";

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
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [email, setEmail] = useState("");
  const handleEmailSubmit = async (emailFormData: EmailSignUpFormData) => {
    setEmail(emailFormData.email);
    await signIn("email", { email: emailFormData.email, redirect: false });
    setShowVerificationStep(true);
  };

  return (
    <UnauthAppShell>
      <Head>
        <title>Draw For Them | Sign In</title>
      </Head>
      <div className="app-container flex h-full w-full flex-col items-center justify-center gap-10">
        <div className="neu-container-raised flex w-72 flex-col items-center justify-center rounded-xl p-4">
          {providers?.email && !showVerificationStep && (
            <EmailLogin csrfToken={csrfToken} onSubmit={handleEmailSubmit} />
          )}
          {showVerificationStep && (
            <VerificationStep email={email} callbackUrl={`https://${host}`} />
          )}
        </div>
        {providers?.google && (
          <div className="neu-container-raised flex w-72 flex-col items-center justify-center rounded-xl p-4">
            <>
              <Btn onClicked={() => signIn(providers.google.id)}>
                <p className="text-xl">Sign in with google</p>
              </Btn>
            </>
          </div>
        )}
      </div>
    </UnauthAppShell>
  );
};

export default SignIn;
