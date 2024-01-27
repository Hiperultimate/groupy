import { useEffect, useRef, useState } from "react";
import SearchInput from "../SearchInput";
import { type DialogElement } from "../CreatePostInput";
import {
  type ChatMemberEditType,
  isChatEditModelOpen,
} from "~/store/atoms/chat";
import { type SetterOrUpdater, useRecoilState } from "recoil";

export const invokeChatMemberEditModal = (
  setIsEditChatModalOpen: SetterOrUpdater<boolean>,
  setChatEditModalData: SetterOrUpdater<{
    chatId: string;
    editType: ChatMemberEditType;
  }>,
  chatId: string,
  editType: ChatMemberEditType
) => {
  setChatEditModalData({ chatId, editType });
  setIsEditChatModalOpen(true);
};

const ChatMemberEditModal = ({
  chatId,
  editType,
}: {
  chatId: string;
  editType: ChatMemberEditType;
}) => {
  const dialogRef = useRef<DialogElement>(null);
  const [isEditChatModalOpen, setIsEditChatModalOpen] =
    useRecoilState(isChatEditModelOpen);
  const [searchInput, setSearchInput] = useState("");

  function outsideModalClickHandler(e: React.MouseEvent) {
    const dialogDimensions = dialogRef.current?.getBoundingClientRect();
    if (
      dialogDimensions &&
      (e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom)
    ) {
      dialogRef.current?.close();
      setIsEditChatModalOpen(false);
    }
  }

  useEffect(() => {
    isEditChatModalOpen === true
      ? dialogRef.current?.showModal()
      : dialogRef.current?.close();
  }, [isEditChatModalOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => outsideModalClickHandler(e)}
      className="rounded-md p-3 w-96"
    >
      <SearchInput
        valueState={searchInput}
        setValueState={setSearchInput}
        placeholder="Search users..."
      />
      <div>User 1</div>
      <div>User 2</div>
    </dialog>
  );
};

export default ChatMemberEditModal;
