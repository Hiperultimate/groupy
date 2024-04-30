import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession, type Session } from "next-auth";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import ChatArea from "~/components/ChatComponent/ChatArea";
import ChatMemberEditModal from "~/components/ChatComponent/ChatMemberEditModal";
import UserChatList from "~/components/ChatComponent/UserChatList";
import useChatConnect from "~/hooks/useChatConnect";
import useJoinChatRoom from "~/hooks/useJoinChatRoom";
import useReceiveChatMessage from "~/hooks/useReceiveChatMessage";
import { authOptions } from "~/server/auth";

import { chatEditModalData, isChatOptionLoading } from "~/store/atoms/chat";

type ServerSideProps = {
  currentUserSession: Session;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      currentUserSession: session,
    },
  };
};

const Chat = ({
  currentUserSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const setIsChatOptionLoading = useSetRecoilState(isChatOptionLoading);

  const socket = useChatConnect();
  const { isLoading } = useJoinChatRoom(socket, currentUserSession.user.id);
  useReceiveChatMessage(socket);

  useEffect(() => {
    setIsChatOptionLoading(isLoading);
  }, [isLoading, setIsChatOptionLoading]);

  return (
    <>
      <ChatMemberEditModal />
      <main className="flex pt-20 font-poppins">
        <div className="w-3/12 border ">
          <UserChatList />
        </div>
        <div className="w-9/12 border border-l-0 ">
          <ChatArea userId={currentUserSession.user.id}/>
        </div>
      </main>
    </>
  );
};

export default Chat;
