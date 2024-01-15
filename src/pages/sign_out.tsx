import type { NextPage } from "next";
import { Routes } from "../enums/routes.enum";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import FullScreenCenter from "../components/ui/FullScreenCenter";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import UnauthAppShell from "../layout/UnauthAppShell";

const SignOut: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    signOut().then(() => {
      router.replace(Routes.SignIn);
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
