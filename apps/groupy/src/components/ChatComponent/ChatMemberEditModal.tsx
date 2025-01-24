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
import { api } from "~/utils/api";
import { toast } from "react-toastify";

type TSearchResult = {
  userId: string;
  userName: string;
  userTag: string;
};

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
  const [searchResult, setSearchResult] = useState<TSearchResult[]>([]);
  const utils = api.useContext();

  const {
    data: groupMembers,
    hasNextPage: hasMoreGroupMembers,
    fetchNextPage: fetchMoreGroupMembers,
    refetch: refetchGroupMembers,
  } = api.group.getGroupMembersExceptModerators.useInfiniteQuery(
    {
      groupId: chatId,
      searchString: searchInput,
      limit: 1,
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
      enabled: false,
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 30 * 1000, // Keep the cached data for 30 seconds
      onSuccess: (data) => {
        const filteredFetchedGroupMembers = data.pages.flatMap((page) =>
          page.groupMembers.map((user) => ({
            userId: user.id,
            userName: user.name,
            userTag: user.atTag,
          }))
        );
        console.log("Checking members data :", filteredFetchedGroupMembers);
        setSearchResult(filteredFetchedGroupMembers);
      },
      onError: (e) => {
        toast.error("Invalid name. Please try again.");
        console.log(e);
      },
    }
  );

  const {
    data: friendListData,
    hasNextPage: hasMoreFriends,
    fetchNextPage: fetchMoreFriends,
    refetch: startFetchingFriends,
  } = api.group.getFriendListNotInGroup.useInfiniteQuery(
    { groupId: chatId, searchString: searchInput, limit: 2 },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
      enabled: false,
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 30 * 1000, // Keep the cached data for 30 seconds
      onSuccess: (data) => {
        const allFetchedFriends = data.pages.flatMap((page) =>
          page.userList.map((user) => ({
            userId: user.id,
            userName: user.name,
            userTag: user.atTag,
          }))
        );
        console.log("Checking data :", allFetchedFriends);
        setSearchResult(allFetchedFriends);
      },
      onError: (e) => {
        toast.error("Invalid name. Please try again.");
        console.log(e);
      },
    }
  );

  // There are bugs in this code while searching and when to refetch. It would be best to isolate these in hooks for now 
  const startFetching = () => {
    const cachedData = utils.group.getFriendListNotInGroup.getInfiniteData({
      groupId: chatId,
      searchString: searchInput,
      limit: 2,
    });

    if (cachedData) {
      // Update search result with all cached pages
      setSearchResult(
        cachedData.pages.flatMap((page) =>
          page.userList.map((user) => ({
            userId: user.id,
            userName: user.name,
            userTag: user.atTag,
          }))
        )
      );

      // Check if more pages exist
      const hasNextPage =
        cachedData.pages[cachedData.pages.length - 1]?.cursor !== undefined;

      if (hasNextPage) {
        fetchMoreFriends(); // Fetch next page if there are more results
      }
    } else {
      startFetchingFriends(); // Fetch initial data from the backend if no cached data exists
    }
  };

  const loadMoreFriends = () => {
    const cachedData = utils.group.getFriendListNotInGroup.getInfiniteData({
      groupId: chatId,
      searchString: searchInput,
      limit: 2,
    });
    console.log("Checking utils :", cachedData);

    // Determine if there are more pages to fetch
    const hasNextPage =
      cachedData?.pages[cachedData.pages.length - 1]?.cursor !== undefined;

    if (hasNextPage) {
      fetchMoreFriends(); // Fetch the next page
    } else {
      console.log("No more pages to fetch, using cached data.");
    }
  };

    // See if you can reduce this startFetching, loadMoreFriends or maybe structure it in a better way
    const startFetchingGroupMembers = () => {
      const cachedData = utils.group.getGroupMembersExceptModerators.getInfiniteData({
        groupId: chatId,
        searchString: searchInput,
        limit: 1,
      });
  
      if (cachedData) {
        // Update search result with all cached pages
        setSearchResult(
          cachedData.pages.flatMap((page) =>
            page.groupMembers.map((user) => ({
              userId: user.id,
              userName: user.name,
              userTag: user.atTag,
            }))
          )
        );
  
        // Check if more pages exist
        const hasNextPage =
          cachedData.pages[cachedData.pages.length - 1]?.cursor !== undefined;
  
        if (hasNextPage) {
          fetchMoreGroupMembers(); // Fetch next page if there are more results
        }
      } else {
        refetchGroupMembers(); // Fetch initial data from the backend if no cached data exists
      }
    };
  
    const loadMoreGroupMembers = () => {
      const cachedData = utils.group.getFriendListNotInGroup.getInfiniteData({
        groupId: chatId,
        searchString: searchInput,
        limit: 2,
      });
      console.log("Checking utils :", cachedData);
  
      // Determine if there are more pages to fetch
      const hasNextPage =
        cachedData?.pages[cachedData.pages.length - 1]?.cursor !== undefined;
  
      if (hasNextPage) {
        fetchMoreGroupMembers(); // Fetch the next page
      } else {
        console.log("No more pages to fetch, using cached data.");
      }
    };

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
    setSearchResult([]);
    switch (editType) {
      case "make_moderator":
      case "remove_member":
        startFetchingGroupMembers();
        break;
      case "invite_member":
        startFetching();
        break;
      default:
        break;
    }
  }, [editType]);

  const timerRef = useRef<null | NodeJS.Timeout>(null);
  const timeoutFn = () => {
    return setTimeout(() => {
      console.log("Fetch users data");
      // startFetching();

      switch (editType) {
        case "make_moderator":
        case "remove_member":
          loadMoreGroupMembers();
          break;
        case "invite_member":
          startFetching();
          break;
        default:
          break;
      }
    }, 500);
  };

  // Get raw users without search , Get users with search
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (chatId) {
      timerRef.current = timeoutFn();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchInput]);

  useEffect(() => {
    isEditChatModalOpen === true
      ? dialogRef.current?.showModal()
      : dialogRef.current?.close();
  }, [isEditChatModalOpen]);

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
            // loadMoreFriends();
            
            switch (editType) {
              case "make_moderator":
              case "remove_member":
                loadMoreGroupMembers();
                break;
              case "invite_member":
                loadMoreFriends();
                break;
              default:
                break;
            }
          }}
        >
          Get more users
        </button>
      </div>
      <div className="h-[450px] overflow-y-scroll pr-2">
        {searchResult.map((user) => {
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
