import React, { useState } from "react";
import { Box, Card, Typography, Grid, Container } from "@mui/material";
import Button from "./elements/Button";
import { Link } from "react-router-dom";
import axios from "axios";

export const Stats = () => {
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(false);
    const [shortUrl, setShortUrl] = useState("");
    const [error, setError] = useState(null);

    const handleTracker = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/analytics/${shortUrl}`);
            const responseData = response.data;

            if (response.status === 200) {

                console.log("Success:", responseData);
                setAnalytics(responseData);
                setError(null);

            } else {

                console.error("Error:", responseData);
                setAnalytics({});
                setError(`Error: ${error.message || "Unknown error"}`);

            }
        } catch (error) {

            console.error("Error tracking URL:", error);
            setAnalytics({});
            setError(`Error: ${error.message || "Unknown error"}`);
            
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await handleTracker();
    };


    return (
        <Box className="container my-14 mx-auto md:px-6">
            <Container maxWidth="md" className=" main_container mt-14 text-white">
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
                    Track Your URLs{" "}
                    <span>
                        <Typography
                            variant="h2"
                            className="inline text-pry"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            Short
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
                                Enter the URL to find out how many clicks it has received so far.
                                <span><Typography variant="h6" sx={{ fontWeight:"light", fontSize:"16px"}} className="text-pee">Example: pjzjsl</Typography></span>
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
                                                id="phone"
                                                required
                                                value={shortUrl}
                                                onChange={(e) => setShortUrl(e.target.value)}
                                                placeholder="Enter Your Scissor Link Here"
                                            />
                                            <Box className="flex justify-center">
                                                <Button
                                                    className="mt-[-1%] font-light py-2 px-3 rounded"
                                                    type="submit"
                                                    disabled={loading}>
                                                    {loading ? "Hang on..." : "View Clicks"}  
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </form>
                                {Object.keys(analytics).length > 0 && (
                                    <Box maxWidth="xl" className="mt-6">
                                        <Card sx={{ backgroundColor:"transparent" }}>
                                            <Container maxWidth="md" className="mt-12">
                                                <Typography
                                                    variant="h5"
                                                    sx={{ fontWeight: 'bold' }}
                                                    paragraph
                                                    className="w-full text-pee text-center pb-2 inline"
                                                >
                                                    Original URL: &emsp;
                                                    <span>
                                                        <Typography variant="h6" sx={{ fontWeight: 'light'}} paragraph className="inline text-white"> 
                                                            {analytics.original_url} 
                                                        </Typography>
                                                    </span><br /> <br />
                                                    Shortened URL: &emsp;
                                                    <span>
                                                        <Typography variant="h6" sx={{ fontWeight: 'light'}} paragraph className="inline text-white">
                                                            {analytics.short_url}
                                                        </Typography>
                                                    </span><br /><br />
                                                    Visit Count: &emsp;
                                                    <span>
                                                        <Typography variant="h6" sx={{ fontWeight: 'light'}} paragraph className="inline text-white">
                                                            {analytics.visit_count}
                                                        </Typography>
                                                    </span><br /><br />
                                                    Visits: &emsp;
                                                    <span>
                                                        <Typography variant="h6" sx={{ fontWeight: 'light'}} paragraph className="inline text-white"> 
                                                            {analytics.visits.length > 0 ? analytics.visits.map((visit) => visit.visit_time).join(", ") : "No visits yet"}
                                                        </Typography>
                                                    </span><br /><br />
                                                </Typography>
                                            </Container>
                                        </Card>
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                    <Box maxWidth="xl">
                    <Link to="/shorten-link">
                        <Typography 
                        variant="h6" 
                        sx={{ color: "#FAF2A1", fontWeight: "light", fontSize: "14px", textAlign: "center" }}
                        className="another-link"
                        >
                            Shorten Another Link
                        </Typography>
                    </Link>
                </Box> 
            </Container>
        </Box>
    );
};

