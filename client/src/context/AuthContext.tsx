import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse, User } from "../types";

interface AuthContextType {
    user: User | null;
    saveLogin: (data: AuthResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode}){
    const [ user, setUser ] = useState<User | null>(() => {
        const saved = localStorage.getItem("user");
        return saved ? (JSON.parse(saved) as User): null;
    });
    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null);
    };
    return(
        <AuthContext.Provider value={{ user, saveLogin, logout }}>
            { children }
        </AuthContext.Provider>
    )
}

export function userAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used inside <AuthProvider>");
    }
    return context;
}