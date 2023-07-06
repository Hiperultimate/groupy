import Image from "next/image";
import SvgMessageIcon from "public/SvgMessageIcon";
import SvgPeopleIcon from "public/SvgPeopleIcon";
import SvgThumbsUpIcon from "public/SvgThumbsUpIcon";
import DisplayUserImage from "./DisplayUserImage";
import { type SerializablePost } from "~/pages/home";
import { type CurrentUser } from "~/pages/home";
import { api } from "~/utils/api";
import { useState } from "react";

type DeserializablePost = Omit<
  SerializablePost,
  "createdAt" | "updatedAt" | "authorDOB"
> & { createdAt: Date; updatedAt: Date; authorDOB: Date };

type PostComment = {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  authorName: string;
  authorImage: string | null;
  postId: string;
};

export const DisplayPost = ({
  postData,
  currentUser,
}: {
  postData: DeserializablePost;
  currentUser: CurrentUser;
}) => {
  // TODO:
  // From author ID, get all the required details about the author to add in the post
  // From UserLikedPost table, use id to get all the number of users who liked the post
  // From id fetch comments from posts and keep a counter of all comments for the post
  // From id fetch comments from posts, on Comment btn click fetch comments and display 10 comments (add fetch more)
  // Add suspense to while loading images

  // Handle states for number of comments received and number of comments that needs to be fetched

  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState<PostComment[]>([]);

  async function handleComments() {
    const fetchedComments = await refetchComments();
    if (fetchedComments.data) {
      const dbComments = fetchedComments.data.map((comment) => {
        return { postId: postData.id, ...comment };
      });
      setPostComments(dbComments);
    }
  }

  const {
    data: getComments,
    refetch: refetchComments,
    isFetching: isCommentsFetching,
  } = api.post.getPostComments.useQuery(
    { postID: postData.id },
    { enabled: false }
  );
  const { mutate: addComment, isLoading: isAddingComment } =
    api.post.addCommentToPost.useMutation();

  const {
    id: postID,
    createdAt,
    content: postContent,
    image: postImage,
    tags: postTags,
    authorId, // Will be used to redirect to author specific page
    likeCount,
    commentCount,
    authorName,
    authorAtTag,
    authorProfilePicture,
    authorTags,
  } = postData;
  return (
    <div
      key={postID}
      className="m-3 flex flex-col rounded-lg bg-white font-poppins shadow-md"
    >
      <div className="flex px-3 pt-3">
        <div>
          <DisplayUserImage
            userImage={authorProfilePicture}
            sizeOption="medium"
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex justify-between">
            <div className="mx-3 mt-3 flex flex-wrap">
              <div className="font-bold">{authorName}</div>
              <div className="ml-1 text-grey">{authorAtTag}</div>
            </div>
            <div className="mx-3 mt-3 text-grey">
              {createdAt.toLocaleDateString()}
            </div>
            {/* <div className="mx-3 mt-3 text-grey">June 22</div> */}
          </div>
          <div className="ml-3 flex flex-wrap">
            {authorTags.map((tag) => {
              return (
                <div
                  key={tag.id}
                  className="my-0.5 mr-1 rounded-full bg-orange px-3 py-1 text-white"
                >
                  {`#${tag.name}`}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={`relative my-2 border-t-2 border-light-grey`} />
      <div className="px-3">{postContent}</div>
      <div className="ml-3 flex flex-wrap justify-center py-2">
        {postTags.map((tag) => {
          return (
            <div
              key={tag.id}
              className="my-0.5 mr-1 rounded-full bg-orange px-3 py-1 text-white"
            >
              {`#${tag.name}`}
            </div>
          );
        })}
      </div>
      <div className="relative flex justify-center bg-slate-100">
        {postImage && (
          <Image
            src={postImage}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "auto", height: "auto", maxHeight: "600px" }}
            alt={"An error occured while loading the image."}
          />
        )}
      </div>
      <button className="h-16 bg-orange text-white transition duration-300 ease-in-out hover:bg-light-orange">
        Join up &rarr;
      </button>
      <div className="mx-4 my-6 flex justify-between text-grey">
        <div className="flex gap-11 ">
          <div className="flex">
            <div className="relative bottom-[2px] mx-2">
              <SvgThumbsUpIcon />
            </div>
            {likeCount}
          </div>
          <div className="flex">
            <div className="mx-2">
              <SvgMessageIcon />
            </div>
            {commentCount}
          </div>
        </div>
        <div className="flex">
          <div className="mx-2">
            <SvgPeopleIcon />
          </div>
          1-10
        </div>
      </div>
      <div className={`relative border-t-2 border-light-grey`} />
      <div className="flex rounded-lg bg-white p-3">
        <div>
          <DisplayUserImage sizeOption="small" />
        </div>
        <input
          className="ml-3 w-full rounded-full border-2 pl-5 pr-6"
          type="text"
          name="createPostInput"
          value={comment}
          placeholder="Write a comment..."
          disabled={isAddingComment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.repeat) {
              return;
            }
            if (e.key === "Enter") {
              console.log("Add comment saying : ", comment);
              addComment(
                { postId: postID, addComment: comment },
                {
                  onError: (error) => {
                    console.log(error.message);
                  },
                  onSuccess: (data) => {
                    const newComment = {
                      authorName: currentUser.name,
                      authorImage: currentUser.image,
                      ...data,
                    };
                    setPostComments([...postComments, newComment]);
                  },
                }
              );
              setComment("");
            }
          }}
        />
      </div>
      {postComments.length > 0 && (
        <div className={`relative border-t-2 border-light-grey`} />
      )}
      <div className="flex flex-col">
        {postComments.length > 0 && (
          <div className="px-4 py-3 text-grey">Comments</div>
        )}
        {postComments.length > 0 &&
          postComments.map((comment) => {
            return (
              <div key={comment.id} className="flex">
                {/* Use map to render multiple comments here */}
                <div className="px-3 py-2">
                  <DisplayUserImage
                    userImage={comment.authorImage}
                    sizeOption="small"
                  />
                </div>
                <div>
                  <div className="mx-1 mt-2 flex flex-wrap">
                    <div className="font-bold">{comment.authorName}</div>
                    <span className="relative bottom-1 font-bold text-grey">
                      &nbsp;&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;
                    </span>
                    <div className="ml-1 text-grey">
                      {comment.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  <p className="ml-1 mr-6">{comment.content}</p>
                </div>
              </div>
            );
          })}
      </div>
      <div
        className={`relative border-t-2 ${
          postComments.length > 0 ? "mt-4" : ""
        } border-light-grey`}
      />
      <button
        disabled={isCommentsFetching}
        onClick={() => void handleComments()}
        className="rounded-b-lg py-4 text-grey transition duration-300 ease-in-out hover:cursor-pointer hover:bg-light-grey hover:text-white disabled:bg-loading-grey disabled:text-white"
      >
        Load Comments
      </button>
    </div>
  );
};
