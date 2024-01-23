
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "./elements/Button";



export const Banner = () => {
    return(
        <>
            <Box className="banner  mt-5 w-full md-1/3 px-7 mx-auto relative flex items-stretch justify-between">
                <Box maxWidth="md" className="w-full md-2/3 p-3 ml-6">
                    <Typography variant="h1" sx={{ fontWeight: "bold", textTransform: "capitalize" }} className="pl-4 mt-0 text-white text-5xl">
                        Make every
                        <span>
                            <Typography variant="h1" sx={{ color: "#DE89BE", fontWeight: "bold" }}>
                                connection
                    </Typography></span> count
                    </Typography>
                    <Typography variant="h6" paragraph sx={{ fontWeight: "light", fontSize:"16px", textAlign:"justify" }} 
                        className="mt-1 pl-6 text-sm text-gray-400 py-1 text-xxl animate__animated animate__fadeIn animated__delay__4">
                        Create short links, QR Codes, and Link-in-bio pages. <br />
                        Share them anywhere. Track how well it&apos;s working.
                    </Typography>
                    <Box maxWidth="sm" className="pl-6">
                        <Link to="/shorten-link">
                            <Button className="mt-4">Start For Free</Button>
                        </Link>
                        <Typography variant="h6" paragraph
                            sx={{ fontWeight: "light", color:"#777", fontSize:"14px", marginTop :"10px" }}>
                            &#42; No Login Required&#33;
                        </Typography>
                    </Box>
                </Box>
                <Box className="banner-image video-wrapper embed-responsive-item w-full flex items-center justify-center mx-auto p-3 mr-10">
                    <img src={require("../assets/images/hero.png")} alt="hero banner"
                    className="w-full object-cover  shadow dark:shadow-black/30 py-2 mt-[-10%]" />
                </Box>

            </Box>    
        </>
    );
};

