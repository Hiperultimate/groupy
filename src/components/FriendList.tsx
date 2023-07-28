import { api } from "~/utils/api";
import DisplayUserImage from "./DisplayUserImage";

const FriendList = () => {
  // Get list of friends
  const { data: friendList, isLoading: friendListLoading } =
    api.account.getUserFriends.useQuery();

  // Fetch friends list from the database for the current signed in user
  // Revalidate their status after every minute

  const tailwindComponentWidth = "w-72";
  return (
    <div>
      <div className={`${tailwindComponentWidth} rounded-lg bg-white pb-4`}>
        <div className="flex justify-center">
          <div className="pt-2 font-bold">Your friends</div>
        </div>
        <div
          className={`relative my-2 ${tailwindComponentWidth} border-t-2 border-light-grey`}
        />
        <div>
          {friendList?.friendList &&
            friendList?.friendList.map((friend) => {
              return (
                <div
                  key={friend.id}
                  className="flex flex-row items-center px-2 pt-2"
                >
                  <div>
                    <DisplayUserImage
                      userImage={friend.image}
                      sizeOption="medium"
                      // userStatus={true}
                    />
                  </div>
                  <div className="truncate pl-6">{friend.name}</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
