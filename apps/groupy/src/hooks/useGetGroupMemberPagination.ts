import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";

type TSearchResult = {
  userId: string;
  userName: string;
  userTag: string;
};

function getGroupMemberFormat(
  getFriendResultArr: { id: string; name: string; atTag: string }[]
) {
  return getFriendResultArr.map((user) => ({
    userId: user.id,
    userName: user.name,
    userTag: user.atTag,
  }));
}

const useGetGroupMemberPagination = ({
  chatId,
  searchInput,
  limit,
  onSuccess,
  onError,
}: {
  chatId: string;
  searchInput: string;
  limit: number;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const [searchResult, setSearchResult] = useState<TSearchResult[]>([]);
  const utils = api.useContext();

  const {
    data: groupMembers,
    hasNextPage,
    fetchNextPage,
    refetch,
    ...rest
  } = api.group.getGroupMembersExceptModerators.useInfiniteQuery(
    {
      groupId: chatId,
      searchString: searchInput,
      limit,
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
      enabled: false,
      staleTime: 30 * 1000, // Avoid fetching new data for 30 seconds
      cacheTime: 30 * 1000, // Cache data for 30 seconds after it's unused
      onSuccess: (data) => {
        const filteredFetchedGroupMembers = data.pages.flatMap((page) =>
          getGroupMemberFormat(page.groupMembers)
        );
        console.log("Checking members data :", filteredFetchedGroupMembers);
        setSearchResult(filteredFetchedGroupMembers);
        onSuccess && onSuccess();
      },
      onError: (e) => {
        toast.error("Invalid name. Please try again.");
        console.log(e);
        onError && onError();
      },
    }
  );

  const startFetchingGroupMembers = useCallback(() => {
    const cachedData =
      utils.group.getGroupMembersExceptModerators.getInfiniteData({
        groupId: chatId,
        searchString: searchInput,
        limit,
      });

    if (!cachedData) {
      refetch();
      return;
    }

    // Update search result with all cached pages
    setSearchResult(
      cachedData.pages.flatMap((page) =>
        getGroupMemberFormat(page.groupMembers)
      )
    );

    // Check if more pages exist
    const hasNextPage =
      cachedData.pages[cachedData.pages.length - 1]?.cursor !== undefined;

    if (hasNextPage) {
      fetchNextPage();
    }
  }, [
    utils.group.getGroupMembersExceptModerators,
    chatId,
    searchInput,
    limit,
    setSearchResult,
    getGroupMemberFormat,
    fetchNextPage,
    refetch,
  ]);

  const loadMoreGroupMembers = useCallback(() => {
    const cachedData =
      utils.group.getGroupMembersExceptModerators.getInfiniteData({
        groupId: chatId,
        searchString: searchInput,
        limit,
      });

    // Determine if there are more pages to fetch
    const hasNextPage =
      cachedData?.pages[cachedData.pages.length - 1]?.cursor !== undefined;

    if (!hasNextPage) return;

    fetchNextPage(); // Fetch the next page
  }, [
    utils.group.getGroupMembersExceptModerators,
    chatId,
    searchInput,
    limit,
    fetchNextPage,
  ]);

  return {
    searchResult,
    startFetchingGroupMembers,
    loadMoreGroupMembers,
    queryOpts: { refetch, fetchNextPage, hasNextPage, ...rest },
  };
};

export default useGetGroupMemberPagination;
