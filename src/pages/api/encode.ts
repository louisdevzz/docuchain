import type { NextApiRequest, NextApiResponse } from "next";
import JWT from "jsonwebtoken"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if(req.method == "POST"){
    const { idofStudent } = req.body;
    const data = JWT.sign(idofStudent as string,'blockcertify')
    res.status(200).json(data);
  }
}
