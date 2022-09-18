import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Header from "../../components/header/Header";
import LoadingIndicator from "../../components/ui/LoadingIndicator";
import { trpc } from "../../utils/trpc";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "../../server/router";
import { createContext } from "../../server/router/context";
import superjson from "superjson";
import FullScreenCenter from "../../components/ui/FullScreenCenter";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ pid: string }>
) {
  const ssg = createSSGHelpers({
    router: appRouter,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    ctx: await createContext({ req: context.req, res: context.res }),
    transformer: superjson,
  });

  const id = context.params?.pid as string;

  await ssg.prefetchQuery("user.getImageById", { id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

const View: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const { data: image, isLoading } = trpc.useQuery([
    "user.getImageById",
    { id: id },
  ]);

  return (
    <div className="app-container h-[100vh] overflow-hidden">
      <Header />

      <div className="flex flex-col items-center justify-center">
        {isLoading && (
          <FullScreenCenter>
            <LoadingIndicator />
          </FullScreenCenter>
        )}
        <div className="neu-container h-[80vh] w-[90vw] rounded-xl">
          <img src={image?.imageData} />
        </div>
      </div>
    </div>
  );
};

export default View;
