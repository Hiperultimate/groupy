import { type Session } from "next-auth";
import DisplayUserImage from "./DisplayUserImage";

const UserDetails = ({ userData }: { userData: Session }) => {
  const userImage = userData?.user.image;
  const userName = userData?.user.name;
  const userNameTag = userData?.user.atTag;
  const userTags = userData?.user.tags;
  const userSummary = userData?.user.description;

  return (
    <div className="bg-white">
      <DisplayUserImage userImage={userImage} dimensionPx={104} />
      <div>
        <div>{userName}</div>
        <div>@{userNameTag}</div>
      </div>
      <div className="flex gap-1">
        {userTags.map((tag) => {
          return (
            <div key={tag.id} className="bg-orange">
              {tag.name}
            </div>
          );
        })}
      </div>
      {userSummary && (
        <div>
          <div className="text-grey">Your Summary</div>
          <div>{userSummary}</div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
