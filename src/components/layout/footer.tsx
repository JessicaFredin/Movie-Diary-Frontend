import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="bg-[#070707] text-white mt-10">
			<div className="max-w-7xl mx-auto px-6 py-8 border-t border-[#FF414E]">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
					{/* Top Movies */}
					<div>
						<h4 className="font-semibold mb-3">Top Movies</h4>
						<ul className="space-y-2 text-[#FF414E]">
							<li>
								<a href="#" className="hover:underline">
									John Wick 4
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Guardians of Galaxy 3
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Avatar 2
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Scream
								</a>
							</li>
						</ul>
					</div>

					{/* Top TV Shows */}
					<div>
						<h4 className="font-semibold mb-3">Top TV Shows</h4>
						<ul className="space-y-2 text-[#FF414E]">
							<li>
								<a href="#" className="hover:underline">
									The Breaking Bad
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Suits
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Sherlock
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Game of Thrones
								</a>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h4 className="font-semibold mb-3">Support</h4>
						<ul className="space-y-2 text-[#FF414E]">
							<li>
								<a href="#" className="hover:underline">
									About Us
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Terms & Conditions
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Contact us
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Career
								</a>
							</li>
						</ul>
					</div>

					{/* Follow us */}
					<div>
						<h4 className="font-semibold mb-3">Follow us</h4>
						<div className="flex space-x-4">
							<a href="#">
								<FaInstagram className="text-[#FF414E] hover:text-white" />
							</a>
							<a href="#">
								<FaFacebookF className="text-[#FF414E] hover:text-white" />
							</a>
							<a href="#">
								<FaTwitter className="text-[#FF414E] hover:text-white" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
