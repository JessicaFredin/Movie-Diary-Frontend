"use client";

import { createContext, useContext } from "react";
import useSWR from "swr";
import type { User } from "@/types/user";

type AuthContextType = {
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const fetchUser = () => {
	const stored = localStorage.getItem("user");
	return stored ? (JSON.parse(stored) as User) : null;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data: user, mutate } = useSWR<User | null>("auth-user", fetchUser);

	const login = (user: User) => {
		localStorage.setItem("user", JSON.stringify(user));
		mutate(user, false);
	};

	const logout = () => {
		localStorage.removeItem("user");
		mutate(null, false);
	};

	return (
		<AuthContext.Provider value={{ user: user ?? null, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used inside AuthProvider");
	}
	return ctx;
}