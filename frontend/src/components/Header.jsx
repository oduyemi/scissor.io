import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Button from "./elements/Button"
import { Link } from "react-router-dom";


  export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
      setIsMobileMenuOpen(false);
    };

    const renderMobileMenu = () => {
      return (
        isMobileMenuOpen && (
          <Box className="mobile-menu-popup">
            <Box className="mobile-menu-content sm:block md:hidden">           
              <button className="close-button" onClick={closeMobileMenu}>
                X
              </button>
              <Link to="/features" className="mobile-menu-link" onClick={closeMobileMenu}>
                <Typography variant="h6" paragraph sx={{fontWeight: "light" }} className="text-sm">
                  Features
                </Typography>
              </Link>
              
              <Link to="/stats" className="mobile-menu-link" onClick={closeMobileMenu}>
                <Typography variant="h6" sx={{fontWeight: "light" }} paragraph className="text-sm">
                  Statistics
                </Typography>
              </Link>
              <Link to="/get-qr-code" className="mobile-menu-link" onClick={closeMobileMenu}>
                <Typography variant="h6" sx={{fontWeight: "light" }} paragraph className="text-sm">
                  Get QR Code
                </Typography>
              </Link>
              <Link to="/get-original-url" className="mobile-menu-link" onClick={closeMobileMenu}>
                <Typography variant="h6" sx={{fontWeight: "light" }} paragraph className="text-sm">
                  Original URL
                </Typography>
              </Link>
              <Link
                to="/contact"
                className="mobile-menu-link"
                onClick={closeMobileMenu}
              >
                <Typography variant="h6" sx={{fontWeight: "light" }} paragraph className="text-sm">
                  Contact
                </Typography>
              </Link>
              <Link to="/shorten-link" variant="outline" className="mobile-menu-link" onClick={closeMobileMenu}>
                <Button>Get Started</Button>  
              </Link>
            </Box>
          </Box>
        )
      );
    };
  
  return (
    <header className={`bg-transparent main_header`}>
      <nav
        id="header"
        className="bg-transparent text-white"
      >
        <Box className="md:flex items-center sm:hidden nav-icon justify-between" onClick={toggleMobileMenu}>
          <Box className="md:hidden flex items-center">
            <svg
              className="w-12 h-12"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12 4H4a1 1 0 100 2h8a1 1 0 100-2zM4 10a1 1 0 110-2h8a1 1 0 110 2H4zm8 3a1 1 0 100 2H4a1 1 0 100-2h8z"
                clipRule="evenodd"
              />
            </svg>
          </Box>
          <Box className="logo">
            <Link to="/" className="text-l block">
            <img
              src={require("../assets/images/logo/logo.png")}
              alt="logo"
              width="100%"
              className="pl-10 w-40 w-40 mt-[-10px]"
            />
            </Link>
          </Box>
          <ul
            className={`nav-menu-wrapper mx-auto flex-col md:flex-row flex md:space-x-8 mt-8 md:mt-0 text-sm`}
            id="mobile-menu"
          >
            <li>
              <Link
                to="/features">
                <Typography variant="h6" paragraph sx={{fontWeight: "light", fontSize: "16px" }}
                className="hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:p-0">
                  Features
                </Typography>
              </Link>
            </li>
            <li>
              <Link
                to="/stats">
                <Typography variant="h6" paragraph sx={{fontWeight: "light", fontSize: "16px" }}
                className="hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:p-0">
                  Statistics
                </Typography>
              </Link>
            </li>
            <li>
              <Link
                to="/get-qr-code">
                <Typography variant="h6" paragraph sx={{fontWeight: "light", fontSize: "16px" }}
                className="hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:p-0">
                  Get QR Code
                </Typography>
              </Link>
            </li>
            <li>
              <Link
                to="/get-original-url">
                <Typography variant="h6" paragraph sx={{fontWeight: "light", fontSize: "16px" }}
                className="hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:p-0">
                  Original URL
                </Typography>
              </Link>
            </li>
            <li>
              <Link
                to="/contact">
                <Typography variant="h6" paragraph sx={{fontWeight: "light", fontSize: "16px" }}
                className="hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:p-0">
                  Contact
                </Typography>
              </Link>
            </li>
          </ul>
          <Box className="header-extras mt-[-3.4%] flex items-center justify-between space-x-4 pr-14">
              <Link to="/shorten-link">
                <Button className="px-6">Get Started</Button>
            </Link>
          </Box>
        </Box>
      </nav>
      {renderMobileMenu()}
    </header>
  );  
};


