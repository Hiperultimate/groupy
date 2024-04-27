import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession, type Session } from "next-auth";
import { useRecoilValue } from "recoil";

import ChatArea from "~/components/ChatComponent/ChatArea";
import ChatMemberEditModal from "~/components/ChatComponent/ChatMemberEditModal";
import UserChatList from "~/components/ChatComponent/UserChatList";
import useChatConnect from "~/hooks/useChatConnect";
import useJoinChatRoom from "~/hooks/useJoinChatRoom";
import useReceiveChatMessage from "~/hooks/useReceiveChatMessage";
import { authOptions } from "~/server/auth";

import { chatEditModalData } from "~/store/atoms/chat";

type ServerSideProps = {
  currentUserSession: Session;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      currentUserSession : session,
    },
  }
};

const Chat = ({ currentUserSession }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const editModalData = useRecoilValue(chatEditModalData);

  const socket = useChatConnect();
  useJoinChatRoom(socket);
  useReceiveChatMessage(socket);

  return (
    <>
      <ChatMemberEditModal
        chatId={editModalData.chatId}
        editType={editModalData.editType}
      />
      <main className="flex pt-20 font-poppins">
        <div className="w-3/12 border ">
          <UserChatList />
        </div>
        <div className="w-9/12 border border-l-0 ">
          <ChatArea />
        </div>
      </main>
    </>
  );
};

export default Chat;
