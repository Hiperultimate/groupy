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
    <div key={notification.id}>
      {isUserTagLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {userTag ? (
            <div>
              <span
                onClick={() => redirectToSelectedUser(userTag.userTag)}
                className="font-bold hover:cursor-pointer hover:underline"
              >
                @{userTag.userTag}
              </span>{" "}
              has sent you a friend request.
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
