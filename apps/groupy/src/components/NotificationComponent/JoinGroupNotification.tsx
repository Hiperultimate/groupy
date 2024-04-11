import type { Notification } from "@prisma/client";
import { notification as notificationState } from "~/store/atoms/notification";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { ColorRing } from "react-loader-spinner";
import { toast } from "react-toastify";
import { api } from "~/utils/api";

const JoinGroupNotification = ({
  notification,
}: {
  notification: Notification;
}) => {
  const router = useRouter();

  const setNotification = useSetRecoilState(notificationState);

  const { data: userTag, isLoading: isUserTagLoading } =
    api.account.getUserTagById.useQuery({
      id: notification.sendingUserId as string,
    });

  const { data: groupName, isLoading: isGroupNameRequestLoading } =
    api.group.getGroupNameFromId.useQuery({
      id: notification.groupId as string,
    });

  const {
    mutate: acceptJoinGroupRequest,
    isLoading: isAcceptJoinGroupRequestLoading,
  } = api.group.acceptJoinGroupRequest.useMutation();

  const {
    mutate: rejectJoinGroupRequest,
    isLoading: isRejectJoinGroupRequestLoading,
  } = api.group.rejectJoinGroupRequest.useMutation();

  function redirectToSelectedUser(userTag: string) {
    void router.push(`/${userTag}`);
  }

  function acceptJoinGroupBtnHandler() {
    acceptJoinGroupRequest(
      { notificationId: notification.id },
      {
        onSuccess: (_) => {
          setNotification((prevNotifs) =>
            prevNotifs.filter((notif) => notif.id !== notification.id)
          );
        },
        onError: (_) => {
          toast.error("Something went wrong while accepting group join request")
        },
      }
    );
  }

  function rejectJoinGroupBtnHandler() {
    rejectJoinGroupRequest(
      { notificationId: notification.id },
      {
        onSuccess: (_) => {
          setNotification((prevNotifs) =>
            prevNotifs.filter((notif) => notif.id !== notification.id)
          );
        },
        onError: (_) => {
          toast.error("Something went wrong while declining group join request")
        },
      }
    );
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
                  disabled={
                    isAcceptJoinGroupRequestLoading ||
                    isRejectJoinGroupRequestLoading
                  }
                  className="rounded-md bg-orange px-4 py-1 text-white shadow-md transition duration-300 ease-in-out hover:bg-light-orange active:bg-loading-grey disabled:bg-loading-grey"
                >
                  Accept
                </button>
                <button
                  onClick={rejectJoinGroupBtnHandler}
                  disabled={
                    isAcceptJoinGroupRequestLoading ||
                    isRejectJoinGroupRequestLoading
                  }
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
