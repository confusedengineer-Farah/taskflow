import type { Request, Response } from "express"
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import prisma from "../lib/prisma"
import { env } from "../config/env"

interface RegisterBody {
    name?: string;
    email?: string;
    password?: string;
}
interface LoginBody {
    email?: string;
    password?: string;
}

const makeToken = (id: number): string => 
    jwt.sign({ id }, env.jwtSecret, {expiresIn: "7d"});

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } =req.body as RegisterBody;
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields"});
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must have 6 char long"})
        }
        const cleanEmail = email.trim().toLocaleLowerCase();
        const exists = await prisma.user.findUnique({where: {email: cleanEmail}});
        if(exists){
            return res.status(400).json({message: "Email is already registered"})
        }
        const hashed = await bcrypt.hash(password,10);
        const user = await prisma.user.create({
            data: {name: name.trim(), email: cleanEmail, password: hashed},
        });
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: makeToken(user.id),
        });
    } catch (error){
        console.error(error);
        res.status(500).json({message: "Server error"})
    }
};

export const login = async ( req: Request, res: Response) => {
    try{
        const { email, password } = req.body as LoginBody;

        if(!email || !password ){
            return res.status(400).json({message: "Please enter email and password."})
        }
        const user = await prisma.user.findUnique({
            where: {email: email.trim().toLowerCase()},
        });
        const match = user? await bcrypt.compare(password, user.password) : false;
        if(!user || !match ){
            return res.status(400).json({ message: "Wrong email and password."})
        }
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: makeToken(user.id),
        });
    } catch (error){
        console.error(error);
        res.status(500).json({ message: "Server error"})
    }
}