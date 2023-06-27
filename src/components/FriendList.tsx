import DisplayUserImage from "./DisplayUserImage";

const FriendList = () => {
  // Get list of friends from the home page
  // Fetch friends list from the database for the current signed in user
  // Revalidate their status after every minute

  return (
    <div>
      <div>Your friends</div>
      <div>
        <div>
          <DisplayUserImage sizeOption="medium" userStatus={true} />
        </div>
      </div>
    </div>
  );
};

export default FriendList;
