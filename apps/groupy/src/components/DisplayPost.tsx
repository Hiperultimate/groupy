import { type Tag } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import SvgMessageIcon from "public/SvgMessageIcon";
import SvgPeopleIcon from "public/SvgPeopleIcon";
import SvgThumbsUpIcon from "public/SvgThumbsUpIcon";
import SvgThumbsUpIconFill from "public/SvgThumbsUpIconFill";
import { useEffect, useState } from "react";
import { ColorRing, Discuss } from "react-loader-spinner";
import { type CurrentUser, type SerializablePost } from "~/pages/home";
import { api } from "~/utils/api";
import DisplayUserImage from "./DisplayUserImage";
import { toast } from "react-toastify";

type PostComment = {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  authorName: string;
  authorImage: string | null;
  postId: string;
};

export type FullPostType = {
  id: string;
  content: string;
  image: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  groupId: string | null;
  groupSize: number | null;
  likeCount: number;
  isUserLikePost: boolean;
  commentCount: number;
  authorName: string;
  authorDOB: string;
  authorEmail: string;
  authorAtTag: string | null;
  authorDescription: string | null;
  authorProfilePicture: string | null;
  authorTags: Tag[];
};

function convertPostDateType(post: FullPostType) {
  const convertedCreatedAt = new Date(post.createdAt);
  const convertedUpdatedAt = new Date(post.updatedAt);
  const convertedAuthorDOB = new Date(post.authorDOB);

  return {
    ...post,
    createdAt: convertedCreatedAt,
    updatedAt: convertedUpdatedAt,
    authorDOB: convertedAuthorDOB,
  };
}

export const DisplayPost = ({
  postData,
  currentUser,
}: {
  postData: SerializablePost;
  currentUser: CurrentUser;
}) => {
  const router = useRouter();

  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState<PostComment[]>([]);
  const [likeCounter, setLikeCounter] = useState(0);
  const [commentCounter, setCommentCounter] = useState(0);
  const [isPostLikedByUser, setIsPostLikedByUser] = useState(false);
  const [loadMoreComments, setLoadMoreComments] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setLikeCounter(postData.likeCount);
    setCommentCounter(postData.commentCount);
    setIsPostLikedByUser(postData.isUserLikePost);
  }, [postData]);

  const { data: authorInfo, isFetching: isUserFetching } =
    api.account.getUserById.useQuery({ userId: postData.authorId });

  const { refetch: refetchComments, isFetching: isCommentsFetching } =
    api.post.getPostComments.useQuery(
      { postID: postData.id, takenComments: postComments.length },
      { enabled: false }
    );

  const { mutate: addComment, isLoading: isAddingComment } =
    api.post.addCommentToPost.useMutation();

  const { mutate: userLikePostMutate, isLoading: isUserLikePostLoading } =
    api.post.likeDislikePost.useMutation({
      onSuccess: ({ isPostLiked }) => {
        setIsPostLikedByUser(isPostLiked);
        isPostLiked
          ? setLikeCounter(likeCounter + 1)
          : setLikeCounter(likeCounter - 1);
      },
    });

  const { mutate: joinGroup, isLoading: isJoiningGroup } =
    api.group.joinGroup.useMutation();

  // Send custom Error page instead
  if (!authorInfo)
    return (
      <div className="m-2 flex h-60 items-center justify-center rounded-lg bg-white shadow-lg">
        <Discuss
          visible={true}
          height="80"
          width="80"
          ariaLabel="comment-loading"
          wrapperStyle={{}}
          wrapperClass="text-green"
          colors={["#ff853e", "#ff853e"]}
        />
      </div>
    );

  const filteredAuthorData = {
    authorName: authorInfo.name,
    authorDOB: authorInfo.dateOfBirth.toString(),
    authorEmail: authorInfo.email,
    authorAtTag: authorInfo.atTag,
    authorDescription: authorInfo.description,
    authorProfilePicture: authorInfo.image,
    authorTags: authorInfo.tags,
  };

  const finalPostData = convertPostDateType({
    ...postData,
    ...filteredAuthorData,
  });

  const {
    id: postID,
    createdAt,
    content: postContent,
    image: postImage,
    tags: postTags,
    authorId, // Will be used to redirect to author specific page
    authorName,
    authorAtTag,
    authorProfilePicture,
    authorTags,
  } = finalPostData;

  async function handleComments() {
    const fetchedComments = await refetchComments();
    if (fetchedComments.data && fetchedComments.data.length === 0) {
      setLoadMoreComments(false);
      return;
    }
    if (fetchedComments.data) {
      const dbComments = fetchedComments.data.map((comment) => {
        return { postId: postData.id, ...comment };
      });
      setPostComments([...postComments, ...dbComments]);
    }
  }

  function handleGroupJoin() {
    console.log("Submit request to join group");
    joinGroup(
      { groupId: postData.groupId as string },
      {
        onSuccess: (data) => {
          toast.success(data.message);
        },
        onError: (_) => {
          toast.error("An error occurred. Please try again later");
        },
      }
    );
  }

  function redirectToSelectedUser() {
    if (authorAtTag) {
      void router.push(`/${authorAtTag}`);
    }
  }

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
            <div
              className="mx-3 mt-3 flex flex-wrap hover:cursor-pointer"
              onClick={redirectToSelectedUser}
            >
              <div className="font-bold">
                <span className=" underline-offset-4 hover:underline">
                  {authorName}
                </span>
              </div>
              <div className="ml-1 text-grey">
                <span className=" underline-offset-4 hover:underline">
                  @{authorAtTag}
                </span>
              </div>
            </div>
            <div className="mx-3 mt-3 text-grey">
              {createdAt.toLocaleDateString()}
            </div>
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
      <div className="min-h-[80px] px-3">{postContent}</div>
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
          <div>
            {isImageLoading && (
              <div className="flex h-72 items-center justify-center">
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              </div>
            )}
            <Image
              src={postImage}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "auto", height: "auto", maxHeight: "600px" }}
              alt={"An error occured while loading the image."}
              onLoadingComplete={() => {
                setIsImageLoading(false);
              }}
            />
          </div>
        )}
      </div>
      {postData.groupId ? (
        <button
          onClick={handleGroupJoin}
          className="h-16 bg-orange text-white transition duration-300 ease-in-out hover:bg-light-orange disabled:bg-amber-600"
          disabled={isJoiningGroup}
        >
          Join up &rarr;
        </button>
      ) : (
        <div className="border" />
      )}
      <div className="mx-4 my-6 flex justify-between text-grey">
        <div className="flex gap-11 ">
          <div className="flex">
            <div
              onClick={() =>
                !isUserLikePostLoading && userLikePostMutate({ postId: postID })
              }
              className="relative bottom-[2px] mx-2 hover:cursor-pointer"
            >
              {isPostLikedByUser ? (
                <SvgThumbsUpIconFill />
              ) : (
                <SvgThumbsUpIcon />
              )}
            </div>
            {likeCounter}
          </div>
          <div className="flex">
            <div className="mx-2">
              <SvgMessageIcon />
            </div>
            {commentCounter}
          </div>
        </div>
        {postData.groupSize && (
          <div className="flex">
            <div className="mx-2">
              <SvgPeopleIcon />
            </div>
            Limit : {postData.groupSize}
          </div>
        )}
      </div>
      <div className={`relative border-t-2 border-light-grey`} />
      <div className="flex rounded-lg bg-white p-3">
        <div>
          <DisplayUserImage userImage={currentUser.image} sizeOption="small" />
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
            if (e.key === "Enter" && comment.length > 0) {
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
                    setCommentCounter(commentCounter + 1);
                    setPostComments([newComment, ...postComments]);
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
        {loadMoreComments ? "Load Comments" : "No Comments To Load"}
      </button>
    </div>
  );
};
