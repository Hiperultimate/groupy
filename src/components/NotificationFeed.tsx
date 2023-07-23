import type { Notification } from "@prisma/client";
import { useState } from "react";
import { api } from "~/utils/api";

const NotificationFeed = () => {

  const { refetch: fetchNotification, isFetching: isNotificationFetching } =
    api.account.getUserNotifications.useQuery(undefined, { enabled: false });

    const [userNotification , setNotification] = useState<Notification[]>([]);

  async function fetchUserNotifications() {
    const getNotifications = await fetchNotification();
    const notifications = getNotifications.data?.userNotifications?.myNotifications;
    console.log("CHECKING :" , notifications);
    if(notifications){
        setNotification([...notifications]);
    }
  }

  return (
    <div
      onClick={() => void fetchUserNotifications()}
      className="rounded-lg bg-white py-2 shadow-md "
    >
      <span className="flex justify-center font-bold hover:cursor-pointer">
        Notifications
      </span>
    </div>
  );
};

export default NotificationFeed;
