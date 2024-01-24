import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { NextPage, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Btn from "../components/ui/Btn";
import FocusableInput from "../components/ui/FocusableInput";
import { Routes } from "../enums/routes.enum";
import { createContext } from "../server/trpc/context";
import { trpc } from "../utils/trpc";

export async function getServerSideProps(context: CreateNextContextOptions) {
  const ctx = await createContext(context);

  if (!ctx.session) {
    return {
      redirect: {
        destination: Routes.SignIn,
        permanent: false,
      },
    };
  }

  if (ctx.session.user?.name) {
    return {
      redirect: {
        destination: Routes.Root,
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: ctx.session,
    },
  };
}

const NewUser: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const [nameInput, setNameInput] = useState("");
  const router = useRouter();

  const {
    mutate: mutateUpdateProfile,
    isPending,
    isSuccess,
    error,
  } = trpc.user.updateUserProfile.useMutation({});

  const handleFriendSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    mutateUpdateProfile({ name: nameInput });
  };

  useEffect(() => {
    if (isSuccess) {
      router.replace(Routes.AddAFriend);
    }
  }, [isSuccess]);

  return (
    <div className="app-container flex max-h-full min-h-screen w-screen flex-row flex-wrap items-center justify-center gap-10 pb-10">
      <div className="neu-container-raised m-8 flex h-full w-full flex-col items-center justify-center gap-6 rounded-xl p-4 md:h-1/2 md:w-1/2">
        <div className="text-center">
          <h1 className="text-2xl">Welcome to Draw For Them</h1>
          <h2 className="text-lg">Let us set up your account</h2>
        </div>
        <form
          onSubmit={handleFriendSearch}
          className="flex w-full flex-col items-center justify-center gap-4 md:w-1/2 "
        >
          <label htmlFor="friend">First up, what&apos;s your name?</label>
          <FocusableInput
            type={"text"}
            id={"name"}
            placeholder={"What's your name?"}
            onChange={(e) => setNameInput((e.target as HTMLInputElement).value)}
          />
          {error && (
            <div className="neu-container-raised-error mt-4 rounded-lg p-2 text-center">
              <p>{error?.shape?.data.zodError?.formErrors}</p>
            </div>
          )}
          <Btn type="submit" className="mt-4 pt-0" loading={isPending}>
            Let&apos;s move on
          </Btn>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
