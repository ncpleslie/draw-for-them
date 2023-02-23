import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useState } from "react";
import { ArrayElement } from "../../utils/helper.utils";
import { trpc } from "../../utils/trpc";
import Btn from "../ui/Btn";
import Icon from "../ui/Icon";
import { useModal } from "../ui/modal/Modal";
import FriendDetailModalBody from "./FriendDetailModal";

interface FriendsDetailProps {
  friends: { id: string; name: string | null }[];
}

const FriendsDetail: React.FC<FriendsDetailProps> = ({ friends }) => {
  const [parent] = useAutoAnimate({ duration: 250 });
  const [friendsList, setFriendsList] = useState(friends);
  const [selectedFriend, setSelectedFriend] =
    useState<ArrayElement<typeof friends>>();

  const { show: showFriendHistoryModal } = useModal(
    (state) => (
      <FriendDetailModalBody
        friend={selectedFriend}
        state={state}
        context={trpc.useContext()}
      />
    ),
    selectedFriend?.name || ""
  );

  const { data: updatedFriendList, mutate: deleteFriendMutate } =
    trpc.user.deleteFriendById.useMutation();

  const deleteFriend = (friend: ArrayElement<typeof friends>) => {
    deleteFriendMutate({ id: friend.id });
  };

  // Update friend list when new friend list data is received.
  useEffect(() => {
    if (updatedFriendList) {
      setFriendsList(updatedFriendList.friends);
    }
  }, [updatedFriendList]);

  // Show friend modal when friend selected.
  useEffect(() => {
    (async () => {
      if (selectedFriend) {
        await showFriendHistoryModal();
      }
    })();

    return () => {
      setSelectedFriend(undefined);
    };
  }, [selectedFriend]);

  return (
    <div
      ref={parent}
      className="neu-container-raised flex h-full w-[90dvw] flex-col items-center justify-center gap-6 rounded-xl p-4 md:mt-8 md:h-1/2 md:w-1/2"
    >
      <h2>Friends ({friendsList.length})</h2>
      {friendsList.map((friend) => (
        <div
          className="neu-container-depressed flex w-full flex-row items-center justify-between rounded-xl p-4 text-xl"
          key={friend.id}
        >
          <p>{friend.name}</p>
          <div className="flex gap-4">
            <Btn
              title={`Show timeline for ${friend.name}`}
              onClicked={() => setSelectedFriend(friend)}
            >
              <Icon.History />
            </Btn>
            <Btn
              className="!text-red-700"
              title={`Show timeline for ${friend.name}`}
              onClicked={() => deleteFriend(friend)}
            >
              <Icon.Trash />
            </Btn>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsDetail;
