import type { Notification } from "@prisma/client";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const FriendRequstMessage = ({
  notification,
}: {
  notification: Notification;
}) => {
  const router = useRouter();
  const { data: userTag, isLoading: isUserTagLoading } =
    api.account.getUserTagById.useQuery({
      id: notification.sendingUserId as string,
    });

  function redirectToSelectedUser(userTag: string) {
    void router.push(`/${userTag}`);
  }

  return (
    <div>
      {isUserTagLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {userTag ? (
            <div className="px-2">
              <div className="flex justify-center">
                <span
                  onClick={() => redirectToSelectedUser(userTag.userTag)}
                  className="font-bold hover:cursor-pointer hover:underline"
                >
                  @{userTag.userTag}
                </span>
                &nbsp;sent you a friend request.
              </div>
              <div className="my-2 flex justify-center gap-4">
                <button className="rounded-md bg-orange px-4 py-1 text-white shadow-md transition duration-300 ease-in-out hover:bg-light-orange active:bg-loading-grey">
                  Accept
                </button>
                <button className="rounded-md bg-orange px-4 py-1 text-white shadow-md transition duration-300 ease-in-out hover:bg-light-orange active:bg-loading-grey">
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendRequstMessage;
