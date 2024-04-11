import { useRouter } from "next/router";
import { ColorRing } from "react-loader-spinner";
import { api } from "~/utils/api";
import DisplayUserImage from "./DisplayUserImage";

const FriendList = () => {
  const router = useRouter();
  // Get list of friends
  const { data: friendList, isLoading: friendListLoading } =
    api.account.getUserFriends.useQuery();

  // Fetch friends list from the database for the current signed in user
  // Revalidate their status after every minute

  const tailwindComponentWidth = "w-72";
  return (
    <div>
      <div
        className={`${tailwindComponentWidth} rounded-lg bg-white pb-4 shadow-lg`}
      >
        <div className="flex justify-center">
          <div className="pt-2 font-bold">Your friends</div>
        </div>
        <div
          className={`relative my-2 ${tailwindComponentWidth} border-t-2 border-light-grey`}
        />
        {friendListLoading ? (
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
          <div className="h-96 overflow-y-auto">
            {friendList?.friendList.length !== 0 ? (
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
                    <span
                      className="truncate pl-6 hover:cursor-pointer hover:underline"
                      onClick={() => {
                        void router.push(`/${friend.atTag}`);
                      }}
                    >
                      {friend.name}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="relative flex h-full items-center justify-center">
                <span className="text-grey">No friends found</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;
