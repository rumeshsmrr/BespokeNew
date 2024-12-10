import React, { useEffect, useState } from "react";
import { delet, get } from "../../Services/ApiEndPoint";
import toast from "react-hot-toast";
import { DeleteUser } from "../../../Backend/Controllers/Admin";
import Navbar from "../Components/Navbar";

const Admin = () => {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user for editing

	useEffect(() => {
		const getUsers = async () => {
			try {
				const request = await get("/api/admin/getuser");
				const response = request.data;

				if (request.status === 200) {
					setUsers(response.user);
				}
			} catch (error) {
				console.log(error);
				if (error.response.status === 401) {
					toast.error("You are not authorized to access admin page");
				}
			}
		};
		getUsers();
	}, []);

	const handleEdit = (user) => {
		setSelectedUser(user); // Set the selected user for editing
	};
	const handleDelete = async (id) => {
		try {
			// Show confirmation toast
			toast(
				(t) => (
					<div>
						<p>Are you sure you want to delete this user?</p>
						<div className="flex justify-end gap-2 mt-5">
							<button
								className="px-4 py-0 text-white bg-red-500 h-8 rounded-[20px] transition-all duration-200 hover:bg-red-600"
								onClick={async () => {
									toast.dismiss(t.id); // Close the toast
									await confirmDelete(id); // Call delete function
								}}
							>
								Delete
							</button>
							<button
								className="px-4 py-0 bg-gray-200 hover:bg-gray-300 transition-all duration-200 h-8 rounded-[20px]"
								onClick={() => toast.dismiss(t.id)} // Close the toast
							>
								Cancel
							</button>
						</div>
					</div>
				),
				{ duration: 10000 } // Extend duration for user interaction
			);
		} catch (error) {
			toast.error("An error occurred while deleting the user");
		}
	};

	const confirmDelete = async (id) => {
		try {
			const request = await delet(`/api/admin/delete/${id}`);
			const response = request.data;

			if (request.status === 200) {
				toast.success("User deleted successfully");
			} else if (request.status === 403) {
				toast.error("Cannot delete admin user");
			}
		} catch (error) {
			if (error.response?.status === 403) {
				toast.error("Cannot delete admin user");
			} else {
				toast.error("An error occurred while deleting the user");
			}
		}
	};

	return (
		<div className="flex flex-col justify-center text-center w-screen mt-24">
			{/* <ProductAdding /> */}

			{/* Pass the selected user to UserManagement */}
		</div>
	);
};

export default Admin;
