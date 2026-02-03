import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
	title: "Movie Diary",
	description: "Track your favorite movies and reviews",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="flex flex-col min-h-screen">
				<AuthProvider>
					<Navbar />
					<MobileBottomNav />
					<main className="flex-1">{children}</main>
					<Footer />
				</AuthProvider>
			</body>
		</html>
	);
}
