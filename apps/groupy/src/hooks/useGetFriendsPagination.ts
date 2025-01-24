import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";

type TSearchResult = {
  userId: string;
  userName: string;
  userTag: string;
};

// Connect hook to ChatMemberEditModal
// Improve this hook by using useCallback and DRY
const useGetFriendsPagination = ({
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
    data: friendListData,
    hasNextPage: hasMoreFriends,
    fetchNextPage,
    refetch,
    ...rest
  } = api.group.getFriendListNotInGroup.useInfiniteQuery(
    { groupId: chatId, searchString: searchInput, limit },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
      enabled: false,
      staleTime: 30 * 1000, // Avoid fetching new data for 30 seconds
      cacheTime: 30 * 1000, // Cache data for 30 seconds after it's unused
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
        onSuccess && onSuccess();
      },
      onError: (e) => {
        toast.error("Invalid name. Please try again.");
        console.log(e);
        onError && onError();
      },
    }
  );

  const startFetchingFriends = () => {
    const cachedData = utils.group.getFriendListNotInGroup.getInfiniteData({
      groupId: chatId,
      searchString: searchInput,
      limit,
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
        fetchNextPage(); // Fetch next page if there are more results
      }
    } else {
      refetch(); // Fetch initial data from the backend if no cached data exists
    }
  };

  const loadMoreFriends = () => {
    const cachedData = utils.group.getFriendListNotInGroup.getInfiniteData({
      groupId: chatId,
      searchString: searchInput,
      limit,
    });
    console.log("Checking inputs : ", chatId, searchInput, limit);
    console.log("Checking utils :", cachedData);

    // Determine if there are more pages to fetch
    const hasNextPage =
      cachedData?.pages[cachedData.pages.length - 1]?.cursor !== undefined;

    console.log("Has next page friends : ", hasNextPage);

    if (hasNextPage) {
      fetchNextPage(); // Fetch the next page
    } else {
      console.log("No more pages to fetch, using cached data.");
    }
  };

  return {
    searchResult,
    startFetchingFriends,
    loadMoreFriends,
    queryOpts: { refetch, fetchNextPage, hasMoreFriends, ...rest },
  };
};

export default useGetFriendsPagination;
