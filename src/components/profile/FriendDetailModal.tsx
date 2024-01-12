import { useState, useEffect } from "react";
import type { trpc } from "../../utils/trpc";
import LoadingIndicator from "../ui/LoadingIndicator";
import type { BaseModalProps } from "../ui/modal/Modal";

interface FriendDetailModalBodyProps extends BaseModalProps {
  friend?: { id: string; name: string | null };
  context: ReturnType<typeof trpc.useContext>;
}

const FriendDetailModalBody: React.FC<FriendDetailModalBodyProps> = ({
  friend,
  context,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] =
    useState<
      Awaited<ReturnType<typeof context.user.getHistoryByUserId.fetch>>
    >();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await context.user.getHistoryByUserId.fetch({
        friendId: friend?.id || "",
      });
      setLoading(false);
      setData(data);
    })();
  }, []);

  return (
    <div className="mt-8 flex flex-col justify-center gap-4 text-icon-inactive">
      <div className="flex flex-row justify-between">
        <p>Sent to {data?.friends[0]?.name}</p>
        <p>({data?.sentImages.length})</p>
      </div>
      <div className="neu-container-depressed rounded-xl p-4">
        {loading ? (
          <div className="flex w-full justify-center">
            <LoadingIndicator />
          </div>
        ) : (
          <>
            {data?.sentImages.map((sent) => (
              <p key={sent.id}>
                {sent.date.toLocaleString()} -{" "}
                {sent.active ? "unopened" : "opened"}
              </p>
            ))}
          </>
        )}
      </div>
      <div className="flex flex-row justify-between">
        <p>Received from {data?.friends[0]?.name}</p>
        <p>({data?.receivedImages.length})</p>
      </div>
      <div className="neu-container-depressed rounded-xl p-4">
        {loading ? (
          <div className="flex w-full justify-center">
            <LoadingIndicator />
          </div>
        ) : (
          <>
            {data?.receivedImages.map((received) => (
              <p key={received.id}>{received.date.toLocaleString()}</p>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default FriendDetailModalBody;
