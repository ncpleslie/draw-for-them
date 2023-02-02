import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";

import FullScreenCenter from "../../components/ui/FullScreenCenter";
import Header from "../../components/header/Header";
import LoadingIndicator from "../../components/ui/LoadingIndicator";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ pid: string }>
) {
  return {
    props: { id: context.params?.pid as string },
  };
}

const View: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const {
    data: image,
    isLoading,
    error,
  } = trpc.user.getImageById.useQuery({
    id,
  });

  return (
    <main className="app-container h-[100vh] overflow-hidden">
      <Header />

      <div className="flex flex-col items-center justify-center p-4">
        {isLoading && (
          <FullScreenCenter>
            <LoadingIndicator />
          </FullScreenCenter>
        )}

        {image && !isLoading && (
          <div className={`neu-container rounded-xl`}>
            <img src={image} />
          </div>
        )}

        {error && <div>I'm sorry. This image is no longer available</div>}
      </div>
    </main>
  );
};

export default View;
