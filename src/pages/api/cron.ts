import { prisma } from "../../server/db";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const wakingSupabase = await prisma.user.findFirst({
    select: { atTag: true },
  });
  console.log("Nudging database...", wakingSupabase);

  return res.status(200).json({ message: "Nudging database..." });
}
