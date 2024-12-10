import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../src/Components/Navbar";
import Footer from "../src/Components/Footer";

function PublicLayout() {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (user && !hasRedirected.current) {
      hasRedirected.current = true; // Prevent multiple redirects
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "user") {
        navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default PublicLayout;
