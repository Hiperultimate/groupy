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
    <div className="m-3 flex flex-col rounded-lg bg-white font-poppins shadow-md">
      <div className="flex px-3 pt-3">
        <div>
          <DisplayUserImage sizeOption="medium" />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex justify-between">
            <div className="mx-3 mt-3 flex flex-wrap">
              <div className="font-bold">Author Name</div>
              <div className="ml-1 text-grey">@AuthorTag</div>
            </div>
            <div className="mx-3 mt-3 text-grey">June 22</div>
          </div>
          <div className="ml-3 flex flex-wrap">
            <div className="my-0.5 mr-1 h-7 rounded-full bg-orange px-3 py-0.5 text-sm text-white">
              Tag1
            </div>
            <div className="my-0.5 mr-1 h-7 rounded-full bg-orange px-3 py-0.5 text-sm text-white">
              Tag2
            </div>
            <div className="my-0.5 mr-1 h-7 rounded-full bg-orange px-3 py-0.5 text-sm text-white">
              Tag3
            </div>
          </div>
        </div>
      </div>
      <div className={`relative my-2 border-t-2 border-light-grey`} />
      <div className="px-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, aliquam
        dignissimos nulla laudantium dolores nihil nisi consectetur tempora id
        deserunt optio necessitatibus eligendi a maxime reprehenderit sapiente
        impedit nemo officia.
      </div>
      <div className="relative flex justify-center bg-slate-100">
        <Image
          src="https://images.unsplash.com/photo-1685454578722-a0cc29a302c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "auto", height: "auto" , maxHeight : "600px" }}
          alt={'An error occured while loading the image.'}
        />
      </div>
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
