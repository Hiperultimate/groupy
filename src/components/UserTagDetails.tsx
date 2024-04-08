import { useSession } from "next-auth/react";
import { ColorRing } from "react-loader-spinner";
import { api } from "~/utils/api";
import DisplayUserImage from "./DisplayUserImage";
import { toast } from "react-toastify";

const UserTagDetails = ({ userTag }: { userTag: string }) => {
  const { data, isLoading, isError } = api.account.getUserByTag.useQuery({
    atTag: userTag,
  });
  const userId = data?.id;

  const {
    status: isFriendStatus,
    data: isFriend,
    refetch: isFriendRefetch,
  } = api.account.isFriend.useQuery(
    {
      targetUser: userId as string,
    },
    {
      enabled: !!userId,
    }
  );
  const { mutate: friendRequest, isLoading: isSendingFriendRequest } =
    api.account.sendFriendRequestNotification.useMutation({
      onSuccess: () => {
        toast.success("Friend Request Sent!");
      },
    });

  const { mutate: removeFriend } = api.account.unfriend.useMutation();

  const currentUser = useSession();
  const currentUserTag = currentUser.data?.user.atTag;

  const userImage = data?.image;
  const userName = data?.name;
  const userNameTag = userTag;
  const userTags = data?.tags; // Displaying only the top 3 tags
  const userSummary = data?.description;

  const tailwindComponentWidth = "w-[350px]";

  function sendFriendRequestNotification() {
    // data?.id will return user Id everytime
    friendRequest(
      { toUserId: data?.id as string },
      {
        onError: (error) => {
          toast.error(error.message)
        },
      }
    );
  }

  return (
    <div
      className={`p-4 pt-2 ${tailwindComponentWidth} rounded-lg bg-white font-poppins shadow-md`}
    >
      {isError && <div>An error occured</div>}
      {isLoading ? (
        <div className="flex items-center justify-center">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : (
        <div>
          {currentUser.data &&
          currentUserTag !== userNameTag &&
          isFriendStatus === "success" ? (
            <div className="flex justify-end ">
              {isFriend.isFriend ? (
                <button
                  onClick={() => {
                    removeFriend(
                      {
                        firstUserId: userId as string,
                        secondUserId: currentUser.data.user.id,
                      },
                      {
                        onSuccess: () => {
                          void isFriendRefetch();
                        },
                      }
                    );
                  }}
                  className="relative left-2 rounded-md bg-slate-400 px-2 text-white transition-all hover:bg-grey disabled:bg-slate-200"
                >
                  - Unfriend
                </button>
              ) : (
                <button
                  disabled={isSendingFriendRequest}
                  onClick={sendFriendRequestNotification}
                  className="relative left-2 rounded-md bg-slate-400 px-2 text-white transition-all hover:bg-grey disabled:bg-slate-200"
                >
                  + Add friend
                </button>
              )}
            </div>
          ) : (
            <div className="my-2" />
          )}
          <div className="mb-6 flex justify-center">
            <DisplayUserImage userImage={userImage} sizeOption="big" />
          </div>
          <div className="mx-3 mb-3 flex flex-wrap gap-2">
            <div className="font-bold">{userName}</div>
            <div className="text-grey">@{userNameTag}</div>
          </div>
          <div className="mb-3 flex flex-wrap gap-1 text-white">
            {userTags &&
              userTags.map((tag) => {
                return (
                  <div
                    key={tag.id}
                    className="rounded-full bg-orange px-3 py-1"
                  >
                    #{tag.name}
                  </div>
                );
              })}
          </div>
          {userSummary && (
            <div>
              <div
                className={`relative right-4 my-2 ${tailwindComponentWidth} border-t-2 border-light-grey`}
              />
              <div className="text-grey">About</div>
              <div>{userSummary}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserTagDetails;
