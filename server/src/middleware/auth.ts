import type { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"
import prisma from "../lib/prisma"
import { env } from "../config/env"

export default async function auth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if(!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({message: "Not logged in"})
    }
    try {
        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, env.jwtSecret);

        if(typeof decoded=== "string" || typeof decoded.id === "number"){
            return res.status(401).json({ message: "Invalid token"})
        }
        const user = await prisma.user.findUnique({
            where: {id: decoded.id},
            select: { id: true }
        })
        if(!user){
            return res.status(401).json({ message: "User not found"})
        }
        req.userId = user.id;
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token"})
    }
}