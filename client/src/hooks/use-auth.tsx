import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { type SignupInput, type LoginInput } from "@shared/routes";

type User = { id: string; name: string; email: string };

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (data: LoginInput) => Promise<void>;
    signup: (data: SignupInput) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        }
        setIsReady(true);
    }, [token]);

    const loginMutation = useMutation({
        mutationFn: async (data: LoginInput) => {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Login failed");
            return res.json();
        },
        onSuccess: (data) => {
            setToken(data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
        }
    });

    const signupMutation = useMutation({
        mutationFn: async (data: SignupInput) => {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Signup failed");
            return res.json();
        },
        onSuccess: (data) => {
            setToken(data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
        }
    });

    if (!isReady) return null; // Avoid flicker

    return (
        <AuthContext.Provider value={{
            user, token,
            login: loginMutation.mutateAsync,
            signup: signupMutation.mutateAsync,
            logout: () => setToken(null)
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}
