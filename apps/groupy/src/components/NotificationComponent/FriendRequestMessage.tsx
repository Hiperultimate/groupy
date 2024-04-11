import type { Notification } from "@prisma/client";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { api } from "~/utils/api";
import { notification as notificationStore } from "../../store/atoms/notification";
import { ColorRing } from "react-loader-spinner";

const FriendRequestMessage = ({
  notification,
}: {
  notification: Notification;
}) => {
  const router = useRouter();
  const setNotification = useSetRecoilState(notificationStore);

  const { refetch: refetchUserHasNotifications } =
    api.account.userHasNotifications.useQuery();

  const { data: userTag, isLoading: isUserTagLoading } =
    api.account.getUserTagById.useQuery({
      id: notification.sendingUserId as string,
    });

  const { mutate: deleteNotification, isLoading: deletingNotification } =
    api.account.deleteNotification.useMutation({
      onSuccess: async () => {
        await refetchUserHasNotifications();
      },
    });

  const { refetch: refetchFriendList } = api.account.getUserFriends.useQuery();

  const { mutate: addFriend, isLoading: isFriendAddLoading } =
    api.account.addFriend.useMutation({
      onSuccess: async () => {
        deleteNotification({ notificationId: notification.id });
        setNotification((currVal) => {
          const filteredNotifications = currVal.filter((notif) => {
            return notif.id !== notification.id;
          });
          return filteredNotifications;
        });
        await refetchUserHasNotifications();
        await refetchFriendList();
      },
    });

  function redirectToSelectedUser(userTag: string) {
    void router.push(`/${userTag}`);
  }

  function rejectFriendRequest() {
    deleteNotification(
      { notificationId: notification.id },
      {
        onSuccess: () => {
          setNotification((currVal) => {
            const filteredNotifications = currVal.filter((notif) => {
              return notif.id !== notification.id;
            });
            return filteredNotifications;
          });
        },
      }
    );
  }

  function acceptFriendRequest() {
    // type FRIENDREQUEST will always have sendingUserId and receivingUserId
    if (notification.type === "FRIENDREQUEST") {
      addFriend({
        firstUserId: notification.sendingUserId as string,
        secondUserId: notification.receivingUserId,
      });
    }
  }

  return (
    <div>
      {isUserTagLoading ? (
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
          {userTag ? (
            <div className="px-2">
              <div className="flex justify-center text-center">
                <span onClick={() => redirectToSelectedUser(userTag.userTag)}>
                  <span className="font-bold hover:cursor-pointer hover:underline">
                    @{userTag.userTag}
                  </span>
                  &nbsp;sent you a friend request.
                </span>
              </div>
              <div className="my-2 flex justify-center gap-4">
                <button
                  onClick={acceptFriendRequest}
                  disabled={isFriendAddLoading}
                  className="rounded-md bg-orange px-4 py-1 text-white shadow-md transition duration-300 ease-in-out hover:bg-light-orange active:bg-loading-grey disabled:bg-loading-grey"
                >
                  Accept
                </button>
                <button
                  onClick={rejectFriendRequest}
                  className="rounded-md bg-orange px-4 py-1 text-white shadow-md transition duration-300 ease-in-out hover:bg-light-orange active:bg-loading-grey disabled:bg-loading-grey"
                >
                  Reject
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
};

export default FriendRequestMessage;
