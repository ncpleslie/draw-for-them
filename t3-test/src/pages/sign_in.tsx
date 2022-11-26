import { NextPage } from "next";
import { CtxOrReq } from "next-auth/client/_utils";
import { BuiltInProviderType } from "next-auth/providers";
import {
  useSession,
  getProviders,
  signIn,
  ClientSafeProvider,
  LiteralUnion,
  getCsrfToken,
  getSession,
} from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import EmailLogin from "../components/signin/EmailLogin";
import Btn from "../components/ui/Btn";
import FullScreenCenter from "../components/ui/FullScreenCenter";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import { Routes } from "../enums/routes.enum";
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
    props: { providers, csrfToken },
  };
}

interface SignInProps {
  csrfToken?: string;
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

const SignIn: NextPage<SignInProps> = ({ providers, csrfToken }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  const handleEmailSubmit = async (emailFormData: EmailSignUpFormData) => {
    await signIn("email", { email: emailFormData.email });
  };

  if (status === "loading") {
    return (
      <FullScreenCenter>
        <LoadingIndicator />
      </FullScreenCenter>
    );
  }

  return (
    <>
      <div className="app-container flex h-[100vh] w-full flex-row flex-col items-center justify-center gap-10">
        <div className="neu-container-raised flex w-72 flex-col items-center justify-center rounded-xl p-4">
          {providers?.email && (
            <EmailLogin csrfToken={csrfToken} onSubmit={handleEmailSubmit} />
          )}
        </div>
        <div className="neu-container-raised flex w-72 flex-col items-center justify-center rounded-xl p-4">
          {providers?.google && (
            <>
              <Btn onClicked={() => signIn(providers.google.id)}>
                <p className="text-xl">Sign in with google</p>
              </Btn>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignIn;
