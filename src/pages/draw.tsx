import { NextPage } from "next";
import { getSession, GetSessionParams } from "next-auth/react";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import Header from "../components/header/Header";
import FullScreenCenter from "../components/ui/FullScreenCenter";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import { Routes } from "../enums/routes.enum";
import { trpc } from "../utils/trpc";
import { toast } from "react-toastify";
import Modal from "../components/ui/modal/Modal";

const DrawingArea = dynamic(() => import("../components/draw/DrawingArea"), {
  ssr: false,
  loading: () => (
    <FullScreenCenter>
      <LoadingIndicator />
    </FullScreenCenter>
  ),
});

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: Routes.SignIn,
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

const useModal = <TModal,>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [promiseReject, setPromiseReject] = useState<() => void>();
  const [promiseResolve, setPromiseResolve] =
    useState<(payload: TModal) => void>();
  const [close, setClose] = useState<(value: TModal) => void>();
  const [promise, setPromise] = useState<Promise<TModal>>();

  const show = () => {
    setPromise(
      new Promise((resolve, reject) => {
        setPromiseResolve(() => resolve);
        // setPromiseReject(reject);
      })
    );

    setClose((value: TModal) => {
      if (promiseResolve) {
        promiseResolve(value);
      }
      setIsOpen(false);
    });

    setIsOpen(true);

    return promise;
  };
  return {
    show,
    close,
    isOpen,
  };
};

const Draw: NextPage = () => {
  const { show, close, isOpen } = useModal<string>();

  const sendImage = trpc.user.sendUserImage.useMutation();

  const onSave = async (image: string) => {
    console.log("save");
    try {
      const response = await show();
      console.log(response);

      // await sendImage.mutateAsync({ imageData: image });
      // toast.success("That masterpiece was sent!");
    } catch (e) {
      console.error(e);
      toast.error(
        "Oops! Something went wrong. Please try send that masterpiece again."
      );
    }
  };

  return (
    <main className="app-container h-screen overflow-hidden">
      <Header />
      <Suspense>
        <DrawingArea onSave={onSave} />
      </Suspense>
      {isOpen && <Modal close={close} isOpen={isOpen} />}
    </main>
  );
};

export default Draw;
