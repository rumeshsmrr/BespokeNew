import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import PropTypes from "prop-types";
import { Link, useParams, useNavigate } from "react-router-dom";
import ProductSlider from "../Components/ProductSlider";
import { get } from "../../Services/ApiEndPoint";
import { useDispatch, useSelector } from "react-redux";
import { post } from "../../Services/ApiEndPoint";
import { toast } from "react-hot-toast";

export default function ProductDescription() {
  const user = useSelector((state) => state.Auth.user);
  const userId = user ? user._id : null; // Safely handle `user` being null
  const { id } = useParams();

  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [zoomStyle, setZoomStyle] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const request = await get(`/api/v1/products/${id}`);
        const data = request.data;

        setProductData(data);
        setMainImage(data.images?.[0]?.url || "");
        setLoading(false);
        document.title = `Bespoke Furniture | ${data.name ? data.name : "Product"}`;
      } catch (error) {
        toast.error("Failed to load product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      // Check if user is logged in
      if (!userId) {
        toast.error("Please log in to add products to your cart.");
        navigate("/login"); // Redirect to login page
        return; // Stop further execution
      }

      const requestBody = {
        userId,
        productId: productData._id,
        quantity,
      };

      // Make API call to add product to cart
      const request = await post("/api/v1/cart/add", requestBody);
      toast.success(request.message || "Product added to cart successfully.");
    } catch (error) {
      // Handle API error responses
      if (error.response && error.response.status === 405) {
        toast.error("Product out of stock");
      } else {
        console.error("Error adding product to cart:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const handleIncrease = () => {
    if (quantity < productData.stoke) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error("Cannot exceed available stock");
    }
  };

  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${mainImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading...
      </motion.div>
    );
  }

  if (!productData) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Product not found.
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="max-w-7xl bg-primary rounded-lg p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section: Product Image and Thumbnails */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Main Product Image */}
            <div
              className="w-full h-auto relative rounded-lg overflow-hidden"
              style={{ height: "500px" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={mainImage}
                alt="Product"
                className="rounded-lg object-cover w-full h-full"
                style={zoomStyle.backgroundImage ? { opacity: 0 } : {}}
                draggable="false"
              />
              {zoomStyle.backgroundImage && (
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    backgroundImage: zoomStyle.backgroundImage,
                    backgroundPosition: zoomStyle.backgroundPosition,
                    backgroundSize: zoomStyle.backgroundSize,
                    height: "100%",
                  }}
                ></div>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex justify-start w-full gap-4 mt-4">
              {productData.images?.map((image, index) => (
                <motion.img
                  key={index}
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 ${
                    mainImage === image.url
                      ? "border-secondary-100"
                      : "border-transparent"
                  }`}
                  onClick={() => handleThumbnailClick(image.url)}
                  draggable="false"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Section: Product Details */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex flex-col bg-secondary-200 p-8 rounded-xl">
              <h1 className="text-4xl font-bold text-secondary-100 mb-4">
                {productData.name}
              </h1>
              <p className="text-secondary-100 text-sm mb-2">by Artisan</p>
              <p className="text-3xl font-bold text-secondary-100">
                ${productData.price}
              </p>
              <p className="text-secondary-100 mt-4">
                {productData.description}
              </p>
              <div className="flex items-center mt-6">
                <span className="text-secondary-100 font-semibold">
                  Available:
                </span>
                {productData.stoke > 0 ? (
                  <span className="ml-2 text-green-500 font-semibold">
                    In stock
                  </span>
                ) : (
                  <span className="ml-2 text-red-500 font-semibold">
                    Out of stock
                  </span>
                )}
              </div>
              {/* Quantity Selector */}
              <div className="flex items-center mt-6">
                <span className="text-secondary-100 font-semibold mr-4">
                  Quantity
                </span>
                <button
                  onClick={handleDecrease}
                  className="w-10 h-10 flex items-center justify-center bg-secondary-200 rounded-lg text-secondary-100 hover:bg-secondary-100 hover:text-secondary-200 transition"
                >
                  -
                </button>
                <span className="mx-4 text-secondary-100 font-bold">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="w-10 h-10 flex items-center justify-center bg-secondary-200 rounded-lg text-secondary-100 hover:bg-secondary-100 hover:text-secondary-200 transition"
                >
                  +
                </button>
              </div>
              {/* Total Price */}
              <div className="flex items-center mt-6">
                <span className="text-secondary-100 font-semibold mr-4">
                  Price
                </span>
                <span className="bg-secondary-200 px-4 py-2 rounded-lg text-secondary-100 font-bold">
                  ${productData.price * quantity}
                </span>
              </div>
              {/* Add to Cart Button */}
              <button
                className="mt-8 px-6 py-3 bg-secondary-100 text-primary font-bold rounded-lg shadow-md hover:bg-secondary-200 hover:text-secondary-100 transition"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
            {/* Continue Shopping Button */}
            <Link to="/product-list" className="w-full flex justify-end">
              <button className="mt-4 px-6 py-3 border-2 border-secondary-100 text-secondary-100 font-bold rounded-lg hover:bg-secondary-100 hover:text-primary transition">
                Continue Shopping
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <ProductSlider category={productData.category} />
      </motion.div>
    </>
  );
}

ProductDescription.propTypes = {
  productID: PropTypes.string,
};
