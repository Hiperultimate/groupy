import { type Session } from "next-auth";
import DisplayUserImage from "./DisplayUserImage";

const UserDetails = ({ userData }: { userData: Session }) => {
  const userImage = userData?.user.image;
  return (
    <>
      <DisplayUserImage userImage={userImage} dimentionPx={104} />
    </>
  );
};

export default UserDetails;
