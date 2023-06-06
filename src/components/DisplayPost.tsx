import { type Post } from "@prisma/client";
import DisplayUserImage from "./DisplayUserImage";
import Image from "next/image";

export const DisplayPost = ({ postData }: { postData: Post }) => {
  // TODO:
  // From author ID, get all the required details about the author to add in the post
  // From UserLikedPost table, use id to get all the number of users who liked the post
  // From id fetch comments from posts and keep a counter of all comments for the post
  // From id fetch comments from posts, on Comment btn click fetch comments and display 10 comments (add fetch more)
  // Add suspense to while loading images

  // return <div>{postData.content}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex">
        <DisplayUserImage sizeOption="medium" />
        <div className="flex flex-col">
          <div className="flex">
            <div className="flex">
              <div>Author Name</div>
              <div>@AuthorTag</div>
            </div>
            <div>June 22</div>
          </div>
          <div className="flex">
            <div>Tag1</div>
            <div>Tag2</div>
            <div>Tag3</div>
          </div>
        </div>
      </div>
      <Image src="" alt="Nothing to display" />
      <button>Join up &rarr;</button>
      <div className="flex">
        <div className="flex">
          <div>LikeIcon 110</div>
          <div>CommentsIcon 21</div>
        </div>
        <div>PeopleIcon 1-10</div>
      </div>
      <div className="flex flex-col">
        <div>Comments</div>
        <div className="flex">
          <DisplayUserImage sizeOption="small" />
          <div>
            <div className="flex">
              <div>Author Name</div>
              <div>June 2022</div>
            </div>
            <p>I like the lights that turn up in the night</p>
          </div>
        </div>
        <div className="flex">
          <DisplayUserImage sizeOption="small" />
          <div>
            <div className="flex">
              <div>Author Name</div>
              <div>June 2023</div>
            </div>
            <p>That looks so yellow</p>
          </div>
        </div>
      </div>
    </div>
  );
};
