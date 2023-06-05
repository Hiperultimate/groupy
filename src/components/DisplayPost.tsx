import { type Post } from "@prisma/client";

export const DisplayPost = ({ postData }: { postData: Post }) => {
    // TODO: 
    // From author ID, get all the required details about the author to add in the post
    // From UserLikedPost table, use id to get all the number of users who liked the post
    // From id fetch comments from posts and keep a counter of all comments for the post
    // From id fetch comments from posts, on Comment btn click fetch comments and display 10 comments (add fetch more)
    return <div>{postData.content}</div>;
};
