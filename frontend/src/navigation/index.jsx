import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "../components/Header";
import Landing from "../pages/Landing/index";
import Features from "../pages/Features/index";
import Statistics from "../pages/Stats/index";
import Contact from "../pages/Contact/index";
import GetQrCode from "../pages/GetQrCode/index";
import GetURL from "../pages/GetURL/index";
import Shortner from "../pages/Shortner/index";



export const Navigation = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/features" element={<Features />} />
                <Route path="/stats" element={<Statistics />} />
                <Route path="/get-qr-code" element={<GetQrCode />} />
                <Route path="/get-original-url" element={<GetURL />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shorten-link" element={<Shortner />}  />
            </Routes>
        </BrowserRouter>
    );
};
