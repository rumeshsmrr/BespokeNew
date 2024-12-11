import PropTypes from "prop-types";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { post } from "../../Services/ApiEndPoint";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function ProductCard({ products }) {
	const user = useSelector((state) => state.Auth.user);

	const userId = user ? user._id : null;

	console.log(products);

	const handleAddToCart = async (product) => {
		if (!userId) {
			toast.error("Please log in to add products to your cart.");
			return;
		}
		try {
			const requestBody = {
				userId,
				productId: product._id,
				quantity: 1, // Default quantity
			};

			const request = await post("/api/v1/cart/add", requestBody);
			const response = request.data;

			if (request.status === 200) {
				toast.success(response.message || "Product added to cart successfully");
			} else if (error.response?.status === 405) {
				toast.error("Product out of stock");
			} else {
				toast.error(response.message || "Failed to add product to cart");
			}
		} catch (error) {
			if (error.response?.status === 405) {
				toast.error("Product out of stock");
			} else {
				toast.error(error.response?.message || "Failed to add product to cart");
			}
		}
	};

	return (
		<>
			{products.map((product, index) => (
				<motion.div
					key={index}
					className="relative rounded-lg overflow-hidden bg-secondary-100"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
					style={{
						gridColumn: `span ${product.colSpan}`,
						gridRow: `span ${product.rowSpan}`,
					}}
				>
					{/* Product Image */}
					<Link to={`/product-description/${product._id}`}>
						<img
							src={product.image}
							alt={product.name}
							className="w-full h-full object-cover cursor-pointer transition duration-300 ease-in-out hover:opacity-50"
						/>
					</Link>

					{/* Out of Stock Overlay */}
					{product.stoke <= 0 && (
						<div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
							<p className="text-white text-2xl font-bold">Out of Stock</p>
						</div>
					)}

					{/* Overlay for Price and Icon */}
					<div className="absolute bottom-0 left-0 right-0 h-fit bg-secondary-100-low px-4 py-2 flex justify-between items-center">
						{/* Product Name */}
						<p className="text-white w-4/5 font-semibold text-lg lg:text-xl tracking-widest">
							{product.name}
						</p>

						{/* Add to Cart Icon */}
						<div
							className={`bg-white p-2 w-16 h-16 rounded-tl-2xl absolute right-0 bottom-0 shadow-lg cursor-pointer flex justify-center items-center ${
								product.stock <= 0 ? "opacity-50 pointer-events-none" : ""
							}`} // Disable interaction if out of stock
						>
							<div
								className="bg-secondary-100 w-10 h-10 absolute rounded-md flex items-center justify-center"
								onClick={() => handleAddToCart(product)}
							>
								<FaPlusCircle className="text-white text-xl m-auto " />
							</div>
							<div className="absolute -top-6 right-0">
								<div id="curved-corner-bottomright"></div>
							</div>
							<div className="absolute bottom-0 -left-6">
								<div id="curved-corner-bottomright"></div>
							</div>
						</div>
					</div>
				</motion.div>
			))}
		</>
	);
}

ProductCard.propTypes = {
	products: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			image: PropTypes.string.isRequired,
			colSpan: PropTypes.number.isRequired,
			rowSpan: PropTypes.number.isRequired,
			stock: PropTypes.number.isRequired, // Ensure stock is included
		})
	).isRequired,
};
