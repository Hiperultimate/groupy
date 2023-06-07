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
    <div className="m-3 flex flex-col rounded-lg bg-white p-3 font-poppins shadow-md">
      <div className="flex ">
        <div>
          <DisplayUserImage sizeOption="medium" />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex justify-between">
            <div className="mx-3 mt-3 flex flex-wrap">
              <div className="font-bold">Author NameAuthor NameAuthor Name</div>
              <div className="ml-1 text-grey">@AuthorTag</div>
            </div>
            <div className="mx-3 mt-3 text-grey">June 22</div>
          </div>
          <div className="flex ml-3 flex-wrap">
            <div className="text-sm mr-1 my-0.5 h-7 px-3 py-0.5 rounded-full bg-orange text-white">Tag1</div>
            <div className="text-sm mr-1 my-0.5 h-7 px-3 py-0.5 rounded-full bg-orange text-white">Tag2</div>
            <div className="text-sm mr-1 my-0.5 h-7 px-3 py-0.5 rounded-full bg-orange text-white">Tag3</div>
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
