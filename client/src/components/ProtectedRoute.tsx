import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { userAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode}){
    const { user } = userAuth();
    return user ? <>{ children}</> : <Navigate to = "/login" replace />;
}