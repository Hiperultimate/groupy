import type { Notification } from "@prisma/client";
import { useState } from "react";
import { api } from "~/utils/api";
import { ColorRing } from "react-loader-spinner";
import FriendRequstMessage from "./FriendRequestMessage";

const NotificationFeed = () => {
  const {
    refetch: fetchNotification,
    isFetching: isNotificationFetching,
    isFetched,
  } = api.account.getUserNotifications.useQuery(undefined, { enabled: false });

  const [userNotification, setNotification] = useState<Notification[]>([]);

  async function fetchUserNotifications() {
    const getNotifications = await fetchNotification();
    const notifications =
      getNotifications.data?.userNotifications?.myNotifications;
    if (notifications) {
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

      {isFetched && (
        <div>
          {isNotificationFetching ? (
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
              {userNotification.length !== 0 ? (
                <div>
                  {userNotification.map((notification) => {
                    console.log("CHECK : " , notification);
                    if (notification.type === "FRIENDREQUEST") {
                      return (
                        <div key={notification.id}>
                          <FriendRequstMessage notification={notification} />
                        </div>
                      );
                    }
                    
                  })}
                </div>
              ) : (
                <span>All caught up!</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationFeed;
