import type { NextApiRequest, NextApiResponse } from "next";
import JWT from "jsonwebtoken"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if(req.method == "POST"){
    const { contentHash } = req.body;
    const data = JWT.sign(contentHash,process.env.JWT_TOKEN as string)
    res.status(200).json(data);
  }
}
