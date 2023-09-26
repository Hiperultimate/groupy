import { prisma } from "../../server/db";

export const config = {
  runtime: "edge",
};

export default async function handler() {
  const wakingSupabase = await prisma.user.findFirst();
  console.log("Disturbing supabase :", wakingSupabase);

  return new Response("Supabase is now woke", { status: 200 });
}
