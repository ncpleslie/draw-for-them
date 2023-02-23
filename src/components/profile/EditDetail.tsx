import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import Btn from "../ui/Btn";
import FocusableInput from "../ui/FocusableInput";
import Icon from "../ui/Icon";

interface EditDetailProps {
  onNameEdited: (user: User) => void;
}

const EditDetail: React.FC<EditDetailProps> = ({ onNameEdited }) => {
  const [nameInput, setNameInput] = useState("");

  const {
    data: editProfileData,
    mutate: editProfileMutate,
    isLoading: editProfileLoading,
    error: editProfileError,
  } = trpc.user.updateUserProfile.useMutation({});

  const updateProfile = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    editProfileMutate({ name: nameInput });
  };

  useEffect(() => {
    if (editProfileData) {
      onNameEdited(editProfileData);
    }
  }, [editProfileData]);

  return (
    <div className="neu-container-raised mt-8 flex h-full w-[90dvw] flex-col items-center justify-center gap-6 rounded-xl p-4 md:h-1/2 md:w-1/2">
      <h2 className="text-lg">Edit Profile</h2>
      <form
        onSubmit={updateProfile}
        className="flex w-full flex-col items-center justify-center gap-4 md:w-1/2 "
      >
        <label htmlFor="friend">Name</label>
        <FocusableInput
          type={"text"}
          id={"name"}
          placeholder={"What's your name?"}
          onChange={(e) => setNameInput((e.target as HTMLInputElement).value)}
        />
        {editProfileError && (
          <div className="neu-container-raised-error mt-4 rounded-lg p-2 text-center">
            <p>{editProfileError?.shape?.data.zodError?.formErrors}</p>
          </div>
        )}
        <Btn type="submit" className="mt-4" loading={editProfileLoading}>
          <Icon.Check />
        </Btn>
      </form>
    </div>
  );
};

export default EditDetail;
