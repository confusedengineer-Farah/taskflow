export type Priority = "low" | "medium" | "high";

export interface Task {
    id: number;
    title: string;
    description: string;
    priority: Priority;
    completed: boolean;
    dueDate: string | null;
    createdAt: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}
export interface AuthResponse {
    token: string;
}