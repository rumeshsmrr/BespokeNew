import React, { useEffect, useState } from "react";
import { get, post } from "../../Services/ApiEndPoint";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import PaymentMethodSelection from "../Components/Payment_Method";
import InvoiceModal from "../Components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import PaymentGateway from "../Components/PaymentGateway";
import { motion } from "framer-motion";

const CartPage = () => {
  const [cart, setCart] = useState(null); // Cart data
  const [loading, setLoading] = useState(true); // Loading state
  const user = useSelector((state) => state.Auth.user);
  const [ordernote, setOrdernote] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [discount, setDiscount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);

  const userId = user ? user._id : null;
  const navigate = useNavigate();

  const showInvoiceDetails = (data) => {
    setPurchaseData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
  };

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const request = await get(`/api/v1/cart/${userId}`);
        const data = request.data;
        setCart(data.cart);
      } catch (error) {
        console.error("Error fetching cart data:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleRemoveItem = async (productId) => {
    try {
      const requestBody = { userId, productId };
      const response = await post("/api/v1/cart/remove", requestBody);
      const updatedCart = response.data;
      console.log(updatedCart);
      setCart(updatedCart); // Update cart state
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Generate the PDF
    const pdfBlob = generatePDF({
      orderId: `PH${Date.now()}`,
      totalAmount: cart.totalPrice,
      products: cart.items,
    });
    try {
      // Upload the PDF to Cloudinary
      const invoiceUrl = await uploadPDFToCloudinary(pdfBlob);

      const purchaseData = {
        user: user._id,
        purchaseId: `PH${Date.now()}`,
        purchaseDate: new Date().toISOString(),
        totalAmount: cart.totalPrice,
        paymentMethod: selectedMethod,
        paymentStatus: paymentStatus,
        orderNotes: ordernote,
        discount: discount,
        invoiceUrl: invoiceUrl,
        products: cart.items.map((item) => ({
          products: item.product._id,
          itemName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          totalPrice: item.product.price * item.quantity,
          imageUrl: item.product.images[0]?.url || "",
        })),
      };

      const response = await post("/api/v1/purchase-history", purchaseData);
      if (response.status === 201) {
        toast.success("Checkout successful!");
        await clearCart(user._id);
        showInvoiceDetails(purchaseData);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.text("Invoice", 20, 20);
    doc.text(`Order ID: ${data.orderId}`, 20, 30);
    doc.text(`Total Amount: $${data.totalAmount}`, 20, 40);
    const pdfBlob = doc.output("blob");

    const invoiceNumber = data.orderId || "invoice";
    const fileName = `${invoiceNumber}.pdf`;

    return new File([pdfBlob], fileName, { type: "application/pdf" });
  };

  const uploadPDFToCloudinary = async (pdfBlob) => {
    const formData = new FormData();
    formData.append("file", pdfBlob);
    formData.append("upload_preset", "PDF_Preset");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/pasi123/raw/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      toast.error("Error uploading PDF to Cloudinary:", error);
      throw error;
    }
  };

  const clearCart = async (userId) => {
    try {
      await post("/api/v1/cart/clear", { userId });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No items in the cart.
      </div>
    );
  }

  return (
    <div className="w-full p-8 mt-24">
      <div className="w-full flex justify-center gap-5 items-start">
        {/* Cart Items */}
        <div className="flex flex-col text-lg gap-4 md:w-2/3">
          <motion.div
            className="flex justify-between border py-2 px-4 border-secondary-100 rounded-xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="text-lg font-bold flex-1">Product</p>
            <p className="text-lg font-bold w-24 text-center">Price</p>
            <p className="text-lg font-bold w-24 text-center">Quantity</p>
            <p className="text-lg font-bold w-24 text-right">Total</p>
          </motion.div>
          {cart.items.map((item) => (
            <motion.div
              key={item._id}
              className="flex items-center justify-between border-b py-2 px-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3 }}
            >
              {/* Product Details */}
              <div className="flex items-center flex-1">
                <img
                  src={item.product.images[0]?.url || ""}
                  alt={item.product.name}
                  className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-lg mr-4"
                  draggable="false"
                />
                <span>{item.product.name}</span>
              </div>

              {/* Price */}
              <div className="w-24 text-center">${item.product.price}</div>

              {/* Quantity */}
              <div className="w-24 text-center">{item.quantity}</div>

              {/* Total */}
              <div className="w-24 text-right">
                ${item.product.price * item.quantity}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveItem(item.product._id)}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
            </motion.div>
          ))}
        </div>

        {/* Cart Summary */}
        <motion.div
          className="md:w-1/3 bg-secondary-200 p-6 rounded-xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-lg font-semibold mb-2">
            You have {cart.items.length} items in your cart
          </h2>
          <div className="text-2xl font-bold">${cart.totalPrice}</div>
          <p className="text-sm text-gray-500 mt-2">
            🚚 Next day shipping on all local orders
          </p>
          <textarea
            className="w-full mt-2 self-center p-4 border border-secondary-200 rounded-lg"
            placeholder="Add a note to your order"
            rows={4}
            onChange={(e) => setOrdernote(e.target.value)}
          ></textarea>

          <PaymentGateway />

          <PaymentMethodSelection onChange={handleMethodChange} />
          <button
            className="mt-4 px-6 py-2 bg-secondary-100 text-white rounded-lg hover:bg-primary hover:text-secondary-100"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </motion.div>
      </div>

      {/* Footer Message */}
      <motion.div className="w-full text-center mt-8">
        <p className="text-gray-500 text-xl md:text-4xl font-bold">
          From our hands to your home, we ensure every bespoke piece is
          delivered with <br />
          the same care it was created with.
        </p>
      </motion.div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        purchaseData={purchaseData}
      />
    </div>
  );
};

export default CartPage;
