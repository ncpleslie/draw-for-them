import type { InferGetServerSidePropsType, NextPage } from "next";
import type { CtxOrReq } from "next-auth/client/_utils";
import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
} from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";
import EmailLogin from "../components/signin/EmailLogin";
import { VerificationStep } from "../components/signin/VerificationStep";
import { Routes } from "../enums/routes.enum";
import UnauthAppShell from "../layout/UnauthAppShell";
import type EmailSignUpFormData from "../models/email-signup-form-data.model";
import Icon from "../components/ui/Icon";

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
      <div className="app-container flex h-full w-full flex-col items-center justify-center">
        <div className="relative grid h-full flex-col items-start justify-center md:items-center lg:container lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="bg-muted relative flex-col p-10 text-white dark:border-r md:h-full lg:flex">
            <div className="absolute inset-0 bg-zinc-900"></div>
            <img
              src="/background.jpg"
              className="absolute inset-0 hidden h-full object-none lg:block"
            />
            <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
              <Icon.Pen />
              Draw For Them
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2 rounded-xl bg-black/80 p-4">
                <p className="text-lg">
                  The ephemeral image sharing application
                </p>
                <p className="text-lg">
                  Find your friends, draw an image, and send it to them. Once
                  they view it, it&apos;s gone forever
                </p>
              </blockquote>
            </div>
          </div>
          <div className="mt-4 md:mt-0 lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Create an account
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email below to create your account
                </p>
                <p className="text-muted-foreground text-sm">
                  You&apos;ll be emailed a magic code to continue the sign up
                </p>
              </div>
              <div className="mx-4 grid gap-6 md:mx-0">
                {providers?.email && csrfToken && host && (
                  <EmailLoginSection csrfToken={csrfToken} host={host} />
                )}
              </div>
              <p className="text-muted-foreground px-8 text-center text-sm">
                By clicking continue, you agree to our non-existent{" "}
                <a
                  className="hover:text-primary underline underline-offset-4"
                  href="/terms"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  className="hover:text-primary underline underline-offset-4"
                  href="/privacy"
                >
                  Privacy Policy
                </a>
                . We are only going to store your email address and the images
                you might send.
              </p>
            </div>
          </div>
        </div>
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
    <div className="neu-container-raised flex w-full flex-col items-center justify-center rounded-xl p-4">
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
