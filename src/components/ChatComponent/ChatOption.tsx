import DisplayUserImage from "../DisplayUserImage";

const ChatOption = () => {
  const demoDate = new Date().getHours();
  return (
    <div className="flex">
      <div>
        <DisplayUserImage userImage={null} sizeOption="medium" />
      </div>
      <div>
        <div>John Smith</div>
        <div className="flex">
          <div>That should be perfect, lets go with that!</div>
          <div>{demoDate}h</div>
        </div>
      </div>
      <div className="bg-orange text-white rounded-lg">23</div>
    </div>
  );
};

export default ChatOption;
