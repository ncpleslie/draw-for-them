import type { NextPage } from "next";
import { Routes } from "../enums/routes.enum";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import FullScreenCenter from "../components/ui/FullScreenCenter";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import UnauthAppShell from "../layout/UnauthAppShell";
import { trpc } from "../utils/trpc";

const SignOut: NextPage = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

  useEffect(() => {
    utils.invalidate();
    signOut({ redirect: false, callbackUrl: Routes.SignIn }).then((data) => {
      router.replace(data.url);
    });
  }, []);

  return (
    <UnauthAppShell>
      <FullScreenCenter>
        <LoadingIndicator />
      </FullScreenCenter>
    </UnauthAppShell>
  );
};

export default SignOut;
