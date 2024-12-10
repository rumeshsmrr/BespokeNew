import React from "react";
import img1 from "../assets/images/img13.png";
import img2 from "../assets/images/img20.png";

const AboutUs = () => {
	return (
		<div className="container mx-auto mt-20 p-4">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				{/* First Row */}
				<div className="flex justify-center items-center">
					<img
						src={img1}
						alt="Bespoke Antique Furniture"
						className="w-full h-auto rounded-lg shadow-lg"
					/>
				</div>
				<div className="flex justify-center items-center">
					<div className="text-left p-4">
						<h2 className="text-3xl font-bold mb-4">About Bespoke</h2>
						<p className="text-lg">
							Bespoke is a unique collaboration between U.S. citizens and Sri
							Lankan artisans, specializing in exquisite antique furniture. Our
							mission is to blend timeless craftsmanship with modern elegance,
							creating pieces that resonate with history and beauty.
						</p>
					</div>
				</div>

				{/* Second Row */}
				<div className="flex justify-center items-center md:order-2">
					<img
						src={img2}
						alt="Artisan Craftsmanship"
						className="w-full h-auto rounded-lg shadow-lg"
					/>
				</div>
				<div className="flex justify-center items-center md:order-1">
					<div className="text-left p-4">
						<h2 className="text-3xl font-bold mb-4">Our Heritage</h2>
						<p className="text-lg">
							Our passion for antique furniture stems from a shared love of
							history, craftsmanship, and culture. We work closely with skilled
							artisans in Sri Lanka to bring the finest furniture designs to
							life, combining traditional techniques with modern designs.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutUs;
