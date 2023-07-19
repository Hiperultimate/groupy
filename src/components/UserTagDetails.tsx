import { ColorRing } from "react-loader-spinner";
import { api } from "~/utils/api";
import DisplayUserImage from "./DisplayUserImage";

const UserTagDetails = ({ userTag }: { userTag: string }) => {
  // Fetch user data
  const { data, isLoading, isError } = api.account.getUserByTag.useQuery({
    atTag: userTag,
  });

  // Populate user data to states

  const userImage = data?.image;
  const userName = data?.name;
  const userNameTag = userTag;
  const userTags = data?.tags; // Displaying only the top 3 tags
  const userSummary = data?.description;

  const tailwindComponentWidth = "w-[350px]";

  // Manage loading
  return (
    <div
      className={`p-4 ${tailwindComponentWidth} rounded-lg bg-white font-poppins shadow-md`}
    >
      {isError && <div>An error occured</div>}
      {isLoading ? (
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
          <div className="mb-6 flex justify-center">
            <DisplayUserImage userImage={userImage} sizeOption="big" />
          </div>
          <div className="mx-3 mb-3 flex flex-wrap gap-2">
            <div className="font-bold">{userName}</div>
            <div className="text-grey">@{userNameTag}</div>
          </div>
          <div className="mb-3 flex flex-wrap gap-1 text-white">
            {userTags &&
              userTags.map((tag) => {
                return (
                  <div
                    key={tag.id}
                    className="rounded-full bg-orange px-3 py-1"
                  >
                    #{tag.name}
                  </div>
                );
              })}
          </div>
          {userSummary && (
            <div>
              <div
                className={`relative right-4 my-2 ${tailwindComponentWidth} border-t-2 border-light-grey`}
              />
              <div className="text-grey">About</div>
              <div>{userSummary}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserTagDetails;
