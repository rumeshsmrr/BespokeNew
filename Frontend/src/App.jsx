import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { updateUser } from "./Redux/AuthSlice";

import "./App.css";
import PublicLayout from "../Layouts/PublicLayout";
import UserLayout from "../Layouts/UserLayout";
import AdminLayout from "../Layouts/AdminLayout";
import AuthLayout from "../Layouts/AuthLayout";

import Home from "./Pages/Home";
import ProductList from "./Pages/ProductList";
import AboutUs from "./Components/Aboutus";
import ContactUs from "./Pages/ContactUs";
import ProductDescription from "./Pages/ProductDescription";
import Profile from "./Pages/Profile";
import CartPage from "./Pages/CartPage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProductAdding from "./Pages/Admin/ProductAdding";
import UserManagement from "./Pages/Admin/UserManagement";
import Dashboard from "./Pages/Admin/Dashboard";
import Inventory from "./Pages/Admin/Inventory";
import AdminPurchaseManagement from "./Pages/Admin/AdminPurchaseManagement ";

function App() {
	const user = useSelector((state) => state.Auth.user);
	const dispatch = useDispatch();

	useEffect(() => {
		if (user) {
			dispatch(updateUser());
		}
	}, [user?.id, dispatch]);

	// Protected Route Component
	const ProtectedRoute = ({ children }) => {
		return user ? children : <Navigate to="/login" />;
	};

	return (
		<BrowserRouter>
			<Toaster position="top-center" containerStyle={{ top: 60 }} />
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<PublicLayout />}>
					<Route index element={<Home />} />
					<Route path="product-list" element={<ProductList />} />
					<Route path="aboutus" element={<AboutUs />} />
					<Route path="contactus" element={<ContactUs />} />
					<Route
						path="product-description/:id"
						element={<ProductDescription />}
					/>
				</Route>

				{/* User Routes */}
				<Route path="/" element={<UserLayout />}>
					<Route
						path="profile"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="cart"
						element={
							<ProtectedRoute>
								<CartPage />
							</ProtectedRoute>
						}
					/>
				</Route>

				{/* Admin Routes */}
				<Route path="/admin" element={<AdminLayout />}>
					{/* <Route index element={<Dashboard />} /> */}
					<Route
						path="purchase-management"
						element={<AdminPurchaseManagement />}
					/>
					<Route path="inventory" element={<Inventory />} />
					<Route path="product" element={<ProductAdding />} />
					<Route path="user-management" element={<UserManagement />} />
				</Route>

				{/* Auth Routes */}
				<Route path="/" element={<AuthLayout />}>
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
