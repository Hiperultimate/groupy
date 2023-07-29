import { ColorRing } from "react-loader-spinner";
import { useRecoilState } from "recoil";
import { notification } from "~/store/atoms/notification";
import { api } from "~/utils/api";
import FriendRequestMessage from "./FriendRequestMessage";

const NotificationFeed = () => {
  const {
    refetch: fetchNotification,
    isFetching: isNotificationFetching,
    isFetched,
  } = api.account.getUserNotifications.useQuery(undefined, { enabled: false });

  const [userNotification, setNotification] = useRecoilState(notification);

  async function fetchUserNotifications() {
    const getNotifications = await fetchNotification();
    const notifications =
      getNotifications.data?.userNotifications?.myNotifications;
    if (notifications) {
      setNotification([...notifications]);
    }
  }

  const tailwindComponentWidth = "w-72";

  return (
    <div className="rounded-lg bg-white py-2 shadow-md">
      <span
        className="flex justify-center font-bold hover:cursor-pointer"
        onClick={() => void fetchUserNotifications()}
      >
        Notifications
      </span>
      {isFetched && userNotification.length !== 0 && (
        <div className="">
          <div
            className={`relative my-2 ${tailwindComponentWidth} border-t-2 border-light-grey`}
          />
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
            <div className="h-72 overflow-y-auto overflow-x-hidden">
              {userNotification.length !== 0 ? (
                <div>
                  {userNotification.map((notification, index) => {
                    if (notification.type === "FRIENDREQUEST") {
                      if (index !== 0) {
                        return (
                          <div key={notification.id}>
                            <div
                              className={`relative my-2 ${tailwindComponentWidth} border-t-2 border-light-grey`}
                            />
                            <FriendRequestMessage notification={notification} />
                          </div>
                        );
                      } else {
                        return (
                          <div key={notification.id}>
                            <FriendRequestMessage notification={notification} />
                          </div>
                        );
                      }
                    }
                  })}
                </div>
              ) : (
                <span className="flex h-full items-center justify-center text-grey">
                  All caught up!
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationFeed;
