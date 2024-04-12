import {
    type GetServerSideProps,
    type InferGetServerSidePropsType,
    type NextPage,
} from "next";

import { getPostsFromUserTag } from "~/server/api/routers/posts";

import { prisma } from "~/server/db";
import { getServerAuthSession } from "../../server/auth";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

import { type Tag } from "db_prisma";
import { type Session } from "next-auth";
import type { ParsedUrlQuery } from "querystring";
import BackgroundContainer from "~/components/BackgroundContainer";
import { DisplayPost } from "~/components/DisplayPost";
import FriendList from "~/components/FriendList";
import UserTagDetails from "~/components/UserTagDetails";
import { api } from "~/utils/api";

export type SerializablePost = {
  id: string;
  content: string;
  image: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  groupId : string | null;
  groupSize: number | null;
  tags: Tag[];
  likeCount: number;
  isUserLikePost: boolean;
  commentCount: number;
};

interface QParams extends ParsedUrlQuery {
  atTag?: string;
}

type ServerSideProps = {
  posts: SerializablePost[];
  userTag: string;
};

export type CurrentUser = Session["user"] & {
  name: string;
  image: string | null;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  const session = await getServerAuthSession(ctx);

  // atTag is @username
  const { atTag } = ctx.params as QParams;
  if (!session || !atTag) {
    // Redirect to home page
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const posts = await getPostsFromUserTag(prisma, session, atTag, 0);
  const serializablePosts = posts.map((post) => {
    const convertedCreatedAt = post.createdAt.toString();
    const convertedUpdatedAt = post.updatedAt.toString();
    return {
      ...post,
      createdAt: convertedCreatedAt,
      updatedAt: convertedUpdatedAt,
    };
  });
  return {
    props: { posts: serializablePosts, userTag: atTag },
  };
};

export const userPosts = atom({
  key: "specificUserPosts",
  default: [] as SerializablePost[],
});

const UserSpecificPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({
  posts,
  userTag,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: userSession = null } = useSession();
  const [displayPosts, setDisplayPosts] =
    useRecoilState<SerializablePost[]>(userPosts);

  useEffect(() => {
    setDisplayPosts(posts);
  }, [setDisplayPosts, posts]);

  const { refetch: refetchPosts, isFetching: isPostFetching } =
    api.post.getPostsFromUserTag.useQuery(
      { userTag: userTag, takenPosts: displayPosts.length },
      { enabled: false }
    );

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
      <BackgroundContainer>
        <div className="pt-[80px]">
          <main className="my-8 flex justify-center">
            <div>
              <UserTagDetails userTag={userTag} />
            </div>
            <div className="relative top-[-12px] min-w-[545px] lg:w-[825px]">
              {displayPosts.length === 0 ? (
                <div className="mx-2 mt-3 flex h-full items-center justify-center rounded-lg bg-gradient-to-b  from-slate-700 bg-opacity-20">
                  <span className="text-white">Too quiet here</span>
                </div>
              ) : (
                displayPosts.map((post) => {
                  return (
                    <DisplayPost
                      key={post.id}
                      postData={post}
                      currentUser={userSession.user as CurrentUser}
                    />
                  );
                })
              )}
            </div>
            <FriendList />
          </main>
        </div>
      </BackgroundContainer>
    </>
  );
};

export default UserSpecificPage;
