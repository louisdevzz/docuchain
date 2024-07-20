import type { NextApiRequest, NextApiResponse } from "next";
import JWT from "jsonwebtoken"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if(req.method == "POST"){
        const { token } = req.body;
        const data = JWT.verify(token,'blockcertify')
        res.status(200).json(data);
    }
}
