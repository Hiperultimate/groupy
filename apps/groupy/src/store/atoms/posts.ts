import { atom } from "recoil";
import type { SerializablePost } from "~/pages/home";

export const postsState = atom({
  key: "postsState",
  default: [] as SerializablePost[],
});

export const userPosts = atom({
  key: "specificUserPosts",
  default: [] as SerializablePost[],
});
