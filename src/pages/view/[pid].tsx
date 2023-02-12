import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

import FullScreenCenter from "../../components/ui/FullScreenCenter";
import LoadingIndicator from "../../components/ui/LoadingIndicator";
import AuthAppShell from "../../layout/AuthAppShell";

const View: NextPage = () => {
  const router = useRouter();
  const { pid } = router.query;

  const {
    data: image,
    isLoading,
    error,
  } = trpc.user.getImageById.useQuery({
    id: pid as string,
  });

  return (
    <AuthAppShell>
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

        {error && <div>I&apos;m sorry. This image is no longer available</div>}
      </div>
    </AuthAppShell>
  );
};

export default View;
