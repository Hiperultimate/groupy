import { type Session } from "next-auth";
import DisplayUserImage from "./DisplayUserImage";

const UserDetails = ({ userData }: { userData: Session }) => {
  const userImage = userData?.user.image;
  const userName = userData?.user.name;
  const userNameTag = userData?.user.atTag;
  const userTags = userData?.user.tags.slice(0, 3); // Displaying only the top 3 tags
  const userSummary = userData?.user.description;

  const tailwindComponentWidth = 'w-[350px]';

  return (
    <div
      className={`p-4 ${tailwindComponentWidth} rounded-lg bg-white font-poppins shadow-md`}
    >
      <div className="mb-6 flex justify-center">
        <DisplayUserImage userImage={userImage} sizeOption="big" />
      </div>
      <div className="mx-3 mb-3 flex gap-2 flex-wrap">
        <div className="font-bold">{userName}</div>
        <div className="text-grey">@{userNameTag}</div>
      </div>
      <div className="flex flex-wrap gap-1 text-white mb-3">
        {userTags.map((tag) => {
          return (
            <div key={tag.id} className="rounded-full bg-orange px-3 py-1">
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
          <div className="text-grey">Your Summary</div>
          <div>{userSummary}</div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
