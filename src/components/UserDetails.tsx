import DisplayUserImage from "./DisplayUserImage";

const UserDetails = () => {
  let userImage;
  return (
    <>
      <DisplayUserImage userImage={userImage} dimentionPx={104}/>
    </>
  );
};

export default UserDetails;
