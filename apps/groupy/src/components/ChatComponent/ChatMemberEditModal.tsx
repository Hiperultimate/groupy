import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import SearchInput from "../SearchInput";
import { type DialogElement } from "../CreatePostInput";
import {
  type ChatMemberEditType,
  isChatEditModelOpen,
  chatEditModalData,
} from "~/store/atoms/chat";
import { type SetterOrUpdater, useRecoilState, useRecoilValue } from "recoil";
import SvgCrossIcon from "public/SvgCrossIcon";
import { menuItems } from "./HeaderMenu";
import useGetFriendsPagination from "~/hooks/useGetFriendsPagination";
import useGetGroupMemberPagination from "~/hooks/useGetGroupMemberPagination";
import useHandleModalOutsideClick from "~/hooks/useHandleModalOutsideClick";
import useDebouncer from "~/hooks/useDebouncer";

export const invokeChatMemberEditModal = (
  setIsEditChatModalOpen: SetterOrUpdater<boolean>,
  setChatEditModalData: SetterOrUpdater<{
    chatId: string;
    editType: ChatMemberEditType;
  }>,
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>,
  chatId: string,
  editType: ChatMemberEditType
) => {
  setChatEditModalData({ chatId, editType });
  setIsEditChatModalOpen(true);
  setIsMenuOpen(false);
};

const ChatMemberEditModal = () => {
  const editModalData = useRecoilValue(chatEditModalData);
  const chatId = editModalData.chatId;
  const editType = editModalData.editType;
  const dialogRef = useRef<DialogElement>(null);
  const [isEditChatModalOpen, setIsEditChatModalOpen] =
    useRecoilState(isChatEditModelOpen);
  const [searchInput, setSearchInput] = useState("");
  const { outsideModalClickHandler } = useHandleModalOutsideClick(
    dialogRef,
    isEditChatModalOpen,
    setIsEditChatModalOpen
  );

  const {
    searchResult: groupMemberSearchResult,
    startFetchingGroupMembers,
    loadMoreGroupMembers,
  } = useGetGroupMemberPagination({
    chatId: chatId,
    searchInput: searchInput,
    limit: 1,
  });

  const {
    searchResult: friendSearchResult,
    startFetchingFriends,
    loadMoreFriends,
  } = useGetFriendsPagination({
    chatId: chatId,
    searchInput: searchInput,
    limit: 2,
  });

  const fetchHandlers = {
    make_moderator: startFetchingGroupMembers,
    remove_member: startFetchingGroupMembers,
    invite_member: startFetchingFriends,
  };

  const loadMoreHandlers = {
    make_moderator: loadMoreGroupMembers,
    remove_member: loadMoreGroupMembers,
    invite_member: loadMoreFriends,
  };

  useDebouncer({
    inputState: searchInput,
    durationMS: 500,
    triggerFn: editType ? fetchHandlers[editType] : () => {},
    triggerCondition: chatId ? true : false,
  });

  useEffect(() => {
    fetchHandlers[editType]?.();
  }, [editType]);

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => outsideModalClickHandler(e)}
      className=" w-96 rounded-md p-3 pb-1 pr-0"
    >
      <div className="pb-2 pr-3">
        <SearchInput
          valueState={searchInput}
          setValueState={setSearchInput}
          placeholder="Search users..."
        />
        <button
          onClick={() => {
            loadMoreHandlers[editType]();
          }}
        >
          Get more users
        </button>
      </div>
      <div className="h-[450px] overflow-y-scroll pr-2">
        {(editType === "make_moderator" || editType === "remove_member"
          ? groupMemberSearchResult
          : friendSearchResult
        ).map((user) => {
          return (
            <div
              key={user.userId}
              className="mb-2 flex justify-between rounded-md border border-light-grey"
            >
              <div className="flex flex-col py-3 pl-4">
                <div className="w-40 truncate text-sm">{user.userName}</div>
                <div className="w-40 truncate text-grey">@{user.userTag}</div>
              </div>
              <div>
                <EditModalOptions optionType={editType} />
              </div>
            </div>
          );
        })}
      </div>
    </dialog>
  );
};

const EditModalOptions = ({
  optionType,
}: {
  optionType: ChatMemberEditType;
}) => {
  const buttonTitle = {
    remove_member: "Remove",
    invite_member: "Invite",
    make_moderator: "Promote",
  };

  const buttonBg = {
    remove_member:
      "border-[#FF4141] bg-[#FF4141] hover:bg-[#FF5959] hover:border-[#FF5959] transition",
    invite_member:
      "border-[#68D326] bg-[#68D326] hover:bg-[#70E827] hover:border-[#70E827] transition",
    make_moderator:
      "border-orange bg-orange hover:bg-[#F99163] hover:border-[#F99163] transition",
  };
  return (
    <div
      className={`flex h-full cursor-pointer select-none items-center justify-center rounded-br-md rounded-tr-md border px-3 ${buttonBg[optionType]}`}
    >
      <div className="text-sm text-white">{buttonTitle[optionType]}</div>
      <div className="mx-2 h-4 border border-l-0 border-white py-2" />
      <div
        className={`${
          optionType !== menuItems.remove_member ? "rotate-45" : ""
        }`}
      >
        <SvgCrossIcon fillcolor="#ffffff" size="L" />
      </div>
    </div>
  );
};

export default ChatMemberEditModal;
