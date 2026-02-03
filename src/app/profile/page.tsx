// // // import ProfileBanner from "@/components/profile/profile-banner";
// // // import ProfileAvatar from "@/components/profile/profile-avatar";
// // // import RecentlyLogged from "@/components/profile/recently-logged";
// // // import Recommendations from "@/components/profile/recommendations";
// // // import BottomNav from "@/components/profile/bottom-nav";
// // // import ProfileInfo from "@/components/profile/profile-info";
// // // import ProfileStats from "@/components/profile/profile-stats";

// // // export default function ProfilePage() {
// // // 	return (
// // // 		<div className="min-h-screen flex flex-col">
// // // 			{/* Banner */}
// // // 			<ProfileBanner />

// // // 			{/* Avatar + Info + Stats */}
// // // 			<div className="flex items-start justify-between ">
// // // 				<div>
// // // 					<ProfileAvatar />
// // // 					<ProfileInfo />
// // // 				</div>
// // // 				<div className="mt-6">
// // // 					<ProfileStats />
// // // 				</div>
// // // 			</div>

// // // 			{/* Recently Logged */}
// // // 			<RecentlyLogged />

// // // 			{/* Recommendations */}
// // // 			<Recommendations />

// // // 			{/* Mobile Bottom Nav */}
// // // 			<BottomNav />
// // // 		</div>
// // // 	);
// // // }

// // // app/profile/page.tsx (SERVER)
// // import RecentlyLogged from "@/components/profile/recently-logged";
// // import { getDiary } from "@/lib/diary-storage";
// // import { fetchTvShowDetails } from "@/services/tmdb-services";
// // import { resolveTvProgress } from "@/lib/resolve-tv-progress";
// // import { RecentlyLoggedItem } from "@/types/recently-logged";

// // export default async function ProfilePage() {
// //   const diary = getDiary();

// //  const items: RecentlyLoggedItem[] = await Promise.all(
// // 		diary.map(async (item) => {
// // 			// 🎬 MOVIE
// // 			if (item.type === "movie") {
// // 				return {
// // 					id: item.id,
// // 					type: "movie",
// // 					title: item.title,
// // 					poster: item.poster,
// // 					lastLogged: item.updatedAt,
// // 					status: item.status,
// // 					progressInfo:
// // 						item.status === "completed"
// // 							? { percentage: 100, isFinished: true }
// // 							: undefined,
// // 				};
// // 			}

// // 			// 📺 TV
// // 			if (item.progress) {
// // 				const tv = await fetchTvShowDetails(item.id);
// // 				const progressInfo = resolveTvProgress(tv, item.progress);

// // 				return {
// // 					id: item.id,
// // 					type: "tv",
// // 					title: item.title,
// // 					poster: item.poster,
// // 					lastLogged: item.updatedAt,
// // 					progressInfo,
// // 				};
// // 			}

// // 			// fallback (planned, no progress yet)
// // 			return {
// // 				id: item.id,
// // 				type: "tv",
// // 				title: item.title,
// // 				poster: item.poster,
// // 				lastLogged: item.updatedAt,
// // 			};
// // 		}),
// //  );

// //   return <RecentlyLogged items={items} />;
// // }

// import RecentlyLogged from "@/components/profile/recently-logged";
// import ProfileBanner from "@/components/profile/profile-banner";
// import ProfileAvatar from "@/components/profile/profile-avatar";
// import Recommendations from "@/components/profile/recommendations";
// import BottomNav from "@/components/profile/bottom-nav";
// import ProfileInfo from "@/components/profile/profile-info";
// import ProfileStats from "@/components/profile/profile-stats";

// export default async function ProfilePage() {
// 	return (
// 		<div className="min-h-screen flex flex-col">
// 			{/* Banner */}
// 			<ProfileBanner />

// 			{/* Avatar + Info + Stats */}
// 			<div className="flex items-start justify-between ">
// 				<div>
// 					<ProfileAvatar />
// 					<ProfileInfo />
// 				</div>
// 				<div className="mt-6">
// 					<ProfileStats />
// 				</div>
// 			</div>

// 			{/* Recently Logged */}
// 			<RecentlyLogged />

// 			{/* Recommendations */}
// 			<Recommendations />

// 			{/* Mobile Bottom Nav */}
// 			<BottomNav />
// 		</div>
// 	)
// }

// app/profile/page.tsx (SERVER)
import RecentlyLogged from "@/components/profile/recently-logged";
import ProfileBanner from "@/components/profile/profile-banner";
import ProfileAvatar from "@/components/profile/profile-avatar";
import ProfileInfo from "@/components/profile/profile-info";
import ProfileStats from "@/components/profile/profile-stats";
import BottomNav from "@/components/profile/bottom-nav";
import Recommendations from "@/components/profile/recommendations";

export default async function ProfilePage() {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Banner */}
			<ProfileBanner />

			{/* Avatar + Info + Stats */}
			<div className="flex items-start justify-between ">
				<div>
					<ProfileAvatar />
					<ProfileInfo />
				</div>
				<div className="mt-6">
					<ProfileStats />
				</div>
			</div>

			{/* Recently Logged */}
			<RecentlyLogged />

			{/* Recommendations */}
			<Recommendations />

			{/* Mobile Bottom Nav */}
			<BottomNav />
		</div>
	);
}
