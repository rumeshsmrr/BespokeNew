import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { get } from "../../Services/ApiEndPoint";

export default function HomePageProducts() {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [selectedFilter, setSelectedFilter] = useState("All");
	const [isMobile, setIsMobile] = useState(false);
	const filterOptions = ["BedSide Table", "Chair and Couch", "Other"];

	// Define colSpan and rowSpan patterns for desktop and mobile
	const colSpanPatternDesktop = [1, 1, 1, 2, 1, 1, 2];
	const rowSpanPatternDesktop = [2, 2, 2, 2, 2, 2, 2];

	const colSpanPatternMobile = [2, 2, 2, 2, 2, 2];
	const rowSpanPatternMobile = [1, 2, 1, 2, 1, 2];

	// Detect screen size
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768); // Detect mobile screens (768px breakpoint)
		};

		handleResize(); // Initial check
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// Fetch products from API
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const request = await get("/api/v1/products/");
				const data = request.data;

				// Transform products to match desired format
				const preparedProducts = data.map((product) => ({
					image: product.images[0]?.url || "", // Use the first image as the main image
					name: product.name,
					price: `$${product.price}`,
					category: product.category,
					_id: product._id,
					stoke: product.stoke,
				}));

				setProducts(preparedProducts);
				setFilteredProducts(applyGridPatterns(preparedProducts.slice(0, 7))); // Limit to 7 products initially
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};

		fetchProducts();
	}, [isMobile]);

	// Reapply grid patterns after filtering
	const applyGridPatterns = (items, isMobile) => {
		const colSpanPattern = isMobile
			? colSpanPatternMobile
			: colSpanPatternDesktop;
		const rowSpanPattern = isMobile
			? rowSpanPatternMobile
			: rowSpanPatternDesktop;

		return items.map((product, index) => ({
			...product,
			colSpan: colSpanPattern[index % colSpanPattern.length],
			rowSpan: rowSpanPattern[index % rowSpanPattern.length],
		}));
	};

	// Handle filter change
	const handleFilterChange = (filter) => {
		setSelectedFilter(filter);

		if (filter === "All") {
			setFilteredProducts(applyGridPatterns(products.slice(0, 7))); // Limit to 7 products
		} else {
			const filtered = products.filter((product) =>
				product.category.toLowerCase().includes(filter.toLowerCase())
			);
			setFilteredProducts(applyGridPatterns(filtered.slice(0, 7))); // Limit to 7 filtered products
		}
	};

	return (
		<div className="flex flex-col px-2 w-full items-center mt-5">
			{/* Filter Buttons */}
			<div className="flex justify-end gap-3 px-4 w-full mt-2 mb-4">
				<Link to="/product-list">
					<motion.button
						className="px-2 md:px-4  md:py-2 text-sm md:text-xl tracking-wider font-bold rounded-lg shadow-md "
						initial={{ backgroundColor: "#EBE2DB", color: "#523B2F" }}
						whileHover={{ backgroundColor: "#523B2F", color: "#EBE2DB" }}
						transition={{ duration: 0.5 }}
					>
						All
					</motion.button>
				</Link>
				{filterOptions.map((item) => (
					<motion.button
						key={item}
						onClick={() => handleFilterChange(item)}
						className={`px-2 md:px-4  md:py-2 text-sm md:text-xl tracking-wider font-bold rounded-lg shadow-md  ${
							selectedFilter === item
								? "bg-secondary-100 text-white"
								: "bg-secondary-200 text-secondary-100"
						}`}
						initial={{ backgroundColor: "#EBE2DB", color: "#523B2F" }}
						whileHover={{ backgroundColor: "#523B2F", color: "#EBE2DB" }}
						transition={{ duration: 0.5 }}
					>
						{item}
					</motion.button>
				))}
			</div>
			<div
				className="w-full flex flex-col justify-center  md:grid gap-8 p-2 md:p-4"
				style={
					isMobile
						? { gridTemplateColumns: "1fr" }
						: {
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gridAutoRows: "150px",
							}
				}
			>
				{/* Product Cards */}
				<ProductCard products={filteredProducts} />
			</div>
		</div>
	);
}
