import React, { useState } from "react";
import { Box, Card, Typography, Grid, Container } from "@mui/material";
import Button from "./elements/Button";
import Icon from "@mdi/react";
import { mdiTrayArrowDown } from "@mdi/js";
import axios from "axios";

export const Shorten = () => {
    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [qrCodeImage, setQrCodeImage] = useState({ imageUrl: "" });
    const [error, setError] = useState(null);

    const handleShorten = async () => {
        try {
            setLoading(true);
            var domain = "";
            if (url.startsWith("http://") || url.startsWith("https://")) {
                domain = url.replace(/^https?:\/\//, '');
            }
    
            const response = await axios.post(
                "http://127.0.0.1:8000/shorten-url",
                {
                    original_url: encodeURIComponent(domain),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const responseData = response.data;
    
            if (response.status === 200) {
                console.log("Success:", responseData);
                setShortenedUrl(responseData.shortened_url);
                setQrCodeImage({ imageUrl: `data:image/png;base64,${responseData.qr_code_image}` }); 
                setError(null);
            } else {
                console.error("Error:", response);
                setShortenedUrl("");
                setQrCodeImage({ imageUrl: "" }); 
                setError(`Error: ${responseData.message}`);
            }
        } catch (error) {
            console.error("Error shortening URL:", error);
            setShortenedUrl("");
            setQrCodeImage({ imageUrl: "" });
            setError(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = qrCodeImage.imageUrl;
        link.download = "qr_code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Original URL:", url);
        handleShorten();
    };

    return (
        <Box className="container my-14 mx-auto md:px-6">
            <Container maxWidth="md" className="main_container mt-14 text-white">
                {error && (
                    <div className="text-center">
                    <Typography variant="body1" className="text-goldie mx-auto" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                    </div>
                )}
                <Typography
                    variant="h2"
                    className="inline pl-8 mt-8"
                    align="center"
                    sx={{
                        fontWeight: "bold",
                        marginTop: 6,
                        marginBottom: 3,
                    }}
                >
                    Shorten Your Long{" "}
                    <span>
                        <Typography
                            variant="h2"
                            className="inline text-pry"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            URL
                        </Typography>
                    </span>{" "}
                    Here
                </Typography>
                <Box maxWidth="xl" className="mx-auto mt-4 mb-6 w-full">
                    <Grid maxWidth="xl">
                        <Grid>
                            <Typography
                                variant="h6"
                                sx={{ fontSize: "16px", fontWeight: "light", margin: "auto" }}
                                paragraph
                                className="w-full text-center pb-2"
                            >
                                Enter your long URL here to create a short link and generate QR code.
                                <span>
                                    <Typography variant="h6" sx={{ fontWeight: "light", fontSize: "16px" }} className="text-pee">
                                        Example: http://www.theviennareview.at/archives/2013/the-two-faces-of-viennas-bermuda-triangle
                                    </Typography>
                                </span>
                            </Typography>
                        </Grid>
                        <Grid maxWidth="xl" className="mx-auto w-full">
                            <Card className="shadow appearance-none mt-2" sx={{ backgroundColor: "transparent" }}>
                                <form className="my-4 w-full" onSubmit={handleFormSubmit}>
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Box className="flex items-center gap-2 mx-auto">
                                            <input
                                                className="shadow appearance-none border rounded py-2 px-14 mx-auto text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                                                type="text"
                                                name="url"
                                                required
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                placeholder="Paste Your Link Here"
                                            />
                                            <Box className="flex justify-center">
                                                <Button
                                                    className="mt-[-1%] font-light py-2 px-3 rounded"
                                                    onClick={handleShorten}
                                                    disabled={loading}
                                                >
                                                    {loading ? "Hang on..." : "Shorten Link"}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </form>
                                    {shortenedUrl && qrCodeImage.imageUrl && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                marginTop: 4,
                                            }}
                                        >
                                            <Typography
                                                variant="h5"
                                                sx={{ fontWeight: 'bold' }}
                                                paragraph
                                                className="w-full text-pee text-center pb-2 inline"
                                            >
                                                Shortened URL: &emsp;
                                                <span>
                                                    <Typography variant="h6" sx={{ fontWeight: 'light'}} paragraph className="inline text-white"> 
                                                        {shortenedUrl.shortened_url} 
                                                    </Typography>
                                                </span><br /> <br />                                             
                                            </Typography>
                                            <div className="ml-14 mb-2">
                                            <Card 
                                            className="shadow appearance-none"
                                            sx={{ backgroundColor: "transparent"}}>
                                                <img
                                                    src={qrCodeImage.imageUrl}
                                                    alt="QR Code"
                                                    width={200}
                                                    height={200}
                                                    className="h-32 w-32 object-contain mx-auto"
                                            />
                                            </Card>
                                            <Box className="text-center">
                                                <Button variant="contained"
                                                    onClick = {handleDownload}
                                                    className="font-light py-2 px-4 rounded inline btnUp">
                                                        <span> 
                                                            <Icon path={mdiTrayArrowDown} size={1} 
                                                                className="icons inline" /></span>
                                                                    &nbsp;Download
                                                </Button>
                                            </Box>
                                        </div>
                                        </Box>
                                    )}
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};
