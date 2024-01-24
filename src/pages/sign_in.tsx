import type { InferGetServerSidePropsType, NextPage } from "next";
import type { CtxOrReq } from "next-auth/client/_utils";
import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
  useSession,
} from "next-auth/react";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { Routes } from "../enums/routes.enum";
import UnauthAppShell from "../layout/UnauthAppShell";
import Icon from "../components/ui/Icon";
import AppConstants from "../constants/app.constants";
import Btn from "../components/ui/Btn";
import { useRouter } from "next/router";
import FocusableInput from "../components/ui/FocusableInput";
import { SignUpFormId } from "../enums/signup-form-id.enum";

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

  return {
    props: {
      providers,
      host: context?.req?.headers?.host,
    },
  };
}

const SignIn: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers, host }) => {
  const title = `${AppConstants.appTitle} | Sign In`;
  const router = useRouter();
  const session = useSession();
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    async function fetchCsrfToken() {
      const result = await getCsrfToken();
      if (!result) {
        throw new Error("Can not sign in without a CSRF token");
      }
      setCsrfToken(result);
    }

    /*
      Wait until session is fetched before obtaining csrfToken 
      to prevent synchronization issues caused by both 
      /api/auth/session and /api/auth/csrf setting the cookie. 
      Only happens in dev environment.
    */
    if (session.status !== "loading") {
      fetchCsrfToken();
    }
  }, [session.status]);

  const signInEmail = async (email: string) => {
    await signIn("email", { email: email, redirect: false });
  };

  const handleVerificationCode = async (email: string, code: string) => {
    const callbackUrl = `https://${host}`;
    await router.replace(
      `/api/auth/callback/email?email=${encodeURIComponent(
        email
      )}&token=${code.toUpperCase()}&callbackUrl=${callbackUrl}`
    );
  };

  return (
    <UnauthAppShell>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="app-container flex h-full w-full flex-col items-center justify-center">
        <div className="relative grid h-full flex-col items-start justify-center md:items-center lg:container lg:max-w-none lg:grid-cols-2 lg:px-0">
          <HeroSection />
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
              <div className="mx-4 grid gap-4 md:mx-0">
                {providers?.email && (
                  <EmailLoginSection
                    csrfToken={csrfToken}
                    onEmailLogin={signInEmail}
                    onVerification={handleVerificationCode}
                  />
                )}
                <div className="relative mt-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">
                      Or continue as
                    </span>
                  </div>
                </div>
                {providers?.credentials && (
                  <GuestLoginSection csrfToken={csrfToken} />
                )}
                <DisclaimerSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnauthAppShell>
  );
};

interface GuestLoginSectionProps {
  csrfToken?: string;
}

const GuestLoginSection: React.FC<GuestLoginSectionProps> = ({ csrfToken }) => {
  return (
    <form
      method="post"
      action="/api/auth/callback/credentials"
      className="flex w-full flex-col items-center justify-between gap-4"
    >
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <Btn type="submit" loading={!csrfToken} className="w-full">
        <p className="w-full text-lg">Guest</p>
      </Btn>
    </form>
  );
};

interface EmailLoginSectionProps {
  csrfToken?: string;
  onEmailLogin: (email: string) => Promise<void>;
  onVerification: (email: string, code: string) => Promise<void>;
}

const EmailLoginSection: React.FC<EmailLoginSectionProps> = ({
  csrfToken,
  onEmailLogin,
  onVerification,
}) => {
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [email, setEmail] = useState("");

  const onEmailSubmit = async (email: string) => {
    setEmail(email);
    await onEmailLogin(email);
    setShowVerificationStep(true);
  };

  const onVerificationSubmit = async (code: string) => {
    await onVerification(email, code);
  };

  return (
    <div className="neu-container-raised flex w-full flex-col items-center justify-center rounded-xl p-4">
      {!showVerificationStep && (
        <EmailLogin csrfToken={csrfToken} onSubmit={onEmailSubmit} />
      )}
      {showVerificationStep && (
        <VerificationStep onSubmit={onVerificationSubmit} />
      )}
    </div>
  );
};

interface EmailLoginProps {
  csrfToken?: string;
  onSubmit: (email: string) => Promise<void>;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ csrfToken, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.target as HTMLFormElement);
    const email = form.get(SignUpFormId.Email) as string;
    await onSubmit(email);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-4 mt-4 flex w-full flex-col items-center justify-between gap-4"
    >
      <div className="flex h-full w-full flex-col justify-center gap-4">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <FocusableInput
          type={"email"}
          id={SignUpFormId.Email}
          placeholder={"stickman@example.com"}
          name={SignUpFormId.Email}
          required
        />
      </div>
      <div className="flex flex-row gap-8">
        <Btn type="submit" loading={loading || !csrfToken}>
          <p className="text-lg">Continue</p>
        </Btn>
      </div>
    </form>
  );
};

interface VerificationStepProps {
  onSubmit: (verificationCode: string) => Promise<void>;
}

/**
 * User has inserted the email and now he can put in the verification code
 */
const VerificationStep: React.FC<VerificationStepProps> = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.target as HTMLFormElement);
    const verification = form.get(SignUpFormId.VerificationCode) as string;
    await onSubmit(verification);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-4 mt-4 flex flex-col items-center justify-between gap-4"
    >
      <h2 className="text-center text-lg">
        Insert the magic code you received in your email
      </h2>

      <FocusableInput
        id={SignUpFormId.VerificationCode}
        name={SignUpFormId.VerificationCode}
        type="text"
        placeholder="e.g. 123456"
        autocomplete={false}
      />

      <Btn type="submit" loading={loading}>
        <p className="text-xl">Continue</p>
      </Btn>
    </form>
  );
};

const HeroSection = () => {
  return (
    <div className="bg-muted relative flex-col p-10 text-white dark:border-r md:h-full lg:flex">
      <div className="absolute inset-0 bg-zinc-900"></div>
      <img
        src="/background.jpg"
        className="absolute inset-0 hidden h-full object-none lg:block"
        alt="An image of a stickman"
      />
      <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
        <Icon.Pen />
        {AppConstants.appTitle}
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2 rounded-xl p-4 md:bg-zinc-900/80">
          <p className="text-lg">The ephemeral image sharing application</p>
          <p className="text-lg">
            Find your friends, draw an image, and send it to them. Once they
            view it, it&apos;s gone forever
          </p>
        </blockquote>
      </div>
    </div>
  );
};

const DisclaimerSection = () => {
  return (
    <p className="text-muted-foreground mt-4 px-8 text-center text-sm">
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
      . We are only going to store your email address and the images you might
      send.
    </p>
  );
};

export default SignIn;
