"use client";

import { createBrowserClient } from "@supabase/ssr";

const REMEMBER_ME_KEY = "movie-diary-remember-me";

function getStorage(): Storage | undefined {
	if (typeof window === "undefined") return undefined;

	const rememberMe = window.localStorage.getItem(REMEMBER_ME_KEY);

	return rememberMe === "true" ? window.localStorage : window.sessionStorage;
}

export function setRememberMeStorage(remember: boolean): void {
	if (typeof window === "undefined") return;

	window.localStorage.setItem(REMEMBER_ME_KEY, remember ? "true" : "false");
}

export function getRememberMeStorage(): boolean {
	if (typeof window === "undefined") return false;

	return window.localStorage.getItem(REMEMBER_ME_KEY) === "true";
}

export function createClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			auth: {
				persistSession: true,
				autoRefreshToken: true,
				detectSessionInUrl: true,
				storage: getStorage(),
			},
		},
	);
}
