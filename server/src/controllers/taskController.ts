import type { Request, Response } from "express"
import type { Priority } from "@prisma/client"
import prisma from "../lib/prisma"

const priorities: Priority[] = ["low", "medium", "high"];

interface CreateBody {
    title?:string;
    description?: string;
    priority?: Priority;
    dueDate?: string;
}

interface UpdateBody {
    title?: string;
    description?: string;
    priority?: Priority;
    completed?: boolean;
}

const parseId = (value: string): number | null => {
    const id = Number(value);
    return Number.isInteger(id)? id : null;
};

export const getTasks = async ( req: Request, res: Response ) => {
    try{
        const tasks = await prisma.task.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc"},
        })
        res.json(tasks);
    } catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error"})
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, priority, dueDate } = req.body as CreateBody;
        if(!title || !title.trim()){
            return res.status(400).json({ message: "Title is required"})
        }
        if(priority !== undefined && !priorities.includes(priority)) {
            return res.status(400).json({ message: "Invalid Priority"})
        }
        if(dueDate && Number.isNaN(new Date(dueDate).getTime())){
            return res.status(400).json({ message: "Invalid dueDate"})
        }
        if (req.userId === undefined) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const task = await prisma.task.create({
            data: {
                title: title.trim(),
                description: description ?? "",
                Priority: priority ?? "medium",
                dueDate: dueDate? new Date(dueDate) : null,
                userId: req.userId,
            },
        });
        res.status(201).json({ task })
    } catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error"})
    }
};

export const updateTask = async ( req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id);
        if(id === null){
            return res.status(400).json({ message: "Invalid task id"});
        }
        const { title, description, priority, completed } = req.body as UpdateBody;

        if( title !== undefined && !title.trim()){
            return res.status(400).json({ message: "Title can not be empty"})
        }
        if (priority !== undefined && !priorities.includes(priority)){
            return res.status(400).json({ message: "Invalid Priority"})
        }
        if(completed !== undefined && typeof completed !== "boolean"){
            return res.status(400).json({ message: "Completed must be ture of false"})
        }
        const existing = await prisma.task.findFirst({ where: {id, userId: req.userId}})
        if(!existing){
            return res.status(404).json({ message: "Task not found"})
        }
        const task = await prisma.task.update({
            where: {id },
            data: { title: title?.trim(), description, Priority: priority, completed },
        });
        res.json(task)
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Server error"})
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id);
        if(id === null){
            return res.status(400).json({ Message: "Invalid Task id"})
        }
        const existing = await prisma.task.findFirst({ where: {id, userId: req.userId}})
        if(!existing){
            return res.status(404).json({ message: "Task not found"})
        }
        await prisma.task.delete({ where: { id }})
        res.json({ message: "Task deleted"})
    } catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error"})
    }
}