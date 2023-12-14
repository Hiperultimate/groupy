import { useRecoilState } from "recoil";
import type { CurrentUser, SerializablePost } from "~/pages/home";
import { postsState } from "~/store/atoms/posts";
import { DisplayPost } from "./DisplayPost";
import { api } from "~/utils/api";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export const RenderPosts = ({
  initialPosts,
}: {
  initialPosts: SerializablePost[];
}) => {
  const { data: userSession = null } = useSession();

  const [displayPosts, setDisplayPosts] =
    useRecoilState<SerializablePost[]>(postsState);

  const { refetch: refetchPosts, isFetching: isPostFetching } =
    api.post.getPosts.useQuery(
      { takenPosts: displayPosts.length },
      { enabled: false }
    );

  useEffect(() => {
    setDisplayPosts(initialPosts);
  }, [setDisplayPosts, initialPosts]);

  useEffect(() => {
    async function postFetching() {
      const getNewPosts = await refetchPosts();
      if (!getNewPosts.data) {
        throw Error("Error occured while fetching posts.");
      }

      const serializablePosts = getNewPosts.data.map((post) => {
        const convertedCreatedAt = post.createdAt.toString();
        const convertedUpdatedAt = post.updatedAt.toString();
        return {
          ...post,
          createdAt: convertedCreatedAt,
          updatedAt: convertedUpdatedAt,
        };
      });

      setDisplayPosts([...displayPosts, ...serializablePosts]);
    }

    function onScroll() {
      const isScrollAtBottom =
        document.documentElement.clientHeight + window.scrollY >=
        (document.documentElement.scrollHeight ||
          document.documentElement.clientHeight);

      if (!isPostFetching && isScrollAtBottom) {
        (async () => {
          await postFetching();
        })().catch((error) => {
          console.log(error);
        });
      }
    }

    if (window) {
      window.addEventListener("scroll", onScroll);

      // Clean-up
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }
  }, [displayPosts, setDisplayPosts, isPostFetching, refetchPosts]);

  if (!userSession) {
    return <>Error Occured. No user found!</>;
  }

  return (
    <>
      {displayPosts.map((post) => {
        return (
          <DisplayPost
            key={post.id}
            postData={post}
            currentUser={userSession.user as CurrentUser}
          />
        );
      })}
    </>
  );
};
