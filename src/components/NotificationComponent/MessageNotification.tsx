import type { Notification } from "@prisma/client";
import { notification as notificationState } from "~/store/atoms/notification";
import { useSetRecoilState } from "recoil";
import { api } from "~/utils/api";
import SvgCrossIcon from "public/SvgCrossIcon";

const MessageNotification = ({
  notification,
}: {
  notification: Notification;
}) => {
  const setNotification = useSetRecoilState(notificationState);

  const { mutate: deleteNotification } =
    api.group.deleteNotification.useMutation();

  function deleteNotificationHandler() {
    console.log("Deleting notification");
    deleteNotification(
      { notificationId: notification.id },
      {
        onSuccess: () => {
          setNotification((prevNotifs) =>
            prevNotifs.filter((notif) => notif.id !== notification.id)
          );
        },
      }
    );
  }

  return (
    <div className="flex px-2 text-center">
      <div>
        <span>{notification.message}</span>
      </div>
      <div className="mx-2 my-auto">
        <button
          onClick={deleteNotificationHandler}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-light-grey transition-colors hover:bg-slate-300"
        >
          <SvgCrossIcon />
        </button>
      </div>
    </div>
  );
};

export default MessageNotification;
