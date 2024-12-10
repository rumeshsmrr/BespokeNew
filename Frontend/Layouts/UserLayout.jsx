import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../src/Components/Navbar";
import Footer from "../src/Components/Footer";

const UserLayout = () => {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (user === undefined) {
    // Show a loader while the user data is being fetched
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserLayout;
