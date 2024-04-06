import type { Notification } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ColorRing } from "react-loader-spinner";
import { api } from "~/utils/api";

const JoinGroupNotification = ({
  notification,
}: {
  notification: Notification;
}) => {
  const router = useRouter();

  const { data: userTag, isLoading: isUserTagLoading } =
    api.account.getUserTagById.useQuery({
      id: notification.sendingUserId as string,
    });

  const { data: groupName, isLoading: isGroupNameRequestLoading } =
    api.group.getGroupNameFromId.useQuery({
      id: notification.groupId as string,
    });

  const { mutate: acceptJoinGroupRequest } =
    api.group.acceptJoinGroupRequest.useMutation();

  function redirectToSelectedUser(userTag: string) {
    void router.push(`/${userTag}`);
  }

  function acceptJoinGroupBtnHandler() {
    acceptJoinGroupRequest({ notificationId: notification.id });
  }

  return (
    <>
      {isUserTagLoading || isGroupNameRequestLoading ? (
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
        <>
          {userTag && groupName && (
            <div className="px-2 text-center">
              <div>
                <span
                  onClick={() => redirectToSelectedUser(userTag.userTag)}
                  className="font-bold hover:cursor-pointer hover:underline"
                >{`@${userTag.userTag}`}</span>
                <span>&nbsp;wants to join your group&nbsp;</span>
                <span className="font-bold">{groupName.name}</span>
              </div>
              <div className="my-2 flex justify-center gap-4">
                <button
                  onClick={acceptJoinGroupBtnHandler}
                  //   disabled={isAcceptJoinGroupRequestLoading}
                  className="rounded-md bg-orange px-4 py-1 text-white shadow-md transition duration-300 ease-in-out hover:bg-light-orange active:bg-loading-grey disabled:bg-loading-grey"
                >
                  Accept
                </button>
                <button
                  //   onClick={rejectJoinGroupRequest}
                  className="rounded-md bg-orange px-4 py-1 text-white shadow-md transition duration-300 ease-in-out hover:bg-light-orange active:bg-loading-grey disabled:bg-loading-grey"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default JoinGroupNotification;
