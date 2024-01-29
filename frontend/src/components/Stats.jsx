import React, { useState, useEffect } from "react";
import { Box, Card, Typography, Grid, Container } from "@mui/material";
import Button from "./elements/Button";
import { Link } from "react-router-dom";
import axios from "axios";

export const Stats = () => {
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(false);
    const [shortUrl, setShortUrl] = useState("");

    const handleTracker = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/analytics/${shortUrl}`);

            const responseData = response.data;

            if (response.status === 200) {
                console.log("Success:", responseData);
                setAnalytics(responseData);
            } else {
                console.error("Error:", responseData);
                setAnalytics({});
            }
        } catch (error) {
            console.error("Error tracking URL:", error);
            setAnalytics({});
            alert(`Error tracking URL: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleTracker();
    }, [shortUrl]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleTracker();
    };

    return (
        <Box className="container my-14 mx-auto md:px-6">
            <Container maxWidth="md" className="mt-14">
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
                            className="inline"
                            sx={{
                                color: "#C32F27",
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
                                Example: rb.gy/pjzjsl
                            </Typography>
                        </Grid>
                        <Grid maxWidth="xl" className="mx-auto w-full">
                            <Card className="shadow appearance-none mt-2" sx={{ backgroundColor: "transparent" }}>
                                <form className="my-4 w-full" onSubmit={handleFormSubmit}>
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Box className="flex items-center gap-2 mx-auto">
                                            <input
                                                className="shadow appearance-none border bg-[#FAF2A1] rounded py-2 px-14 mx-auto text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                                                type="text"
                                                id="phone"
                                                required
                                                value={shortUrl}
                                                onChange={(e) => setShortUrl(e.target.value)}
                                                placeholder="Enter Your teeny link here"
                                            />
                                            <Box className="flex justify-center">
                                                <Button
                                                    className="mt-[-1%] text-white font-light py-2 px-3 rounded"
                                                    type="submit"
                                                >
                                                    View Clicks
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </form>
                                {Object.keys(analytics).length > 0 && (
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontSize: '16px', fontWeight: 'light', margin: 'auto' }}
                                            paragraph
                                            className="w-full text-center pb-2"
                                        >
                                            Original URL: {analytics.original_url}
                                            Shortened URL: {analytics.short_url}
                                            Visit Count: {analytics.visit_count}
                                            Visits: {analytics.visits.map((visit) => visit.visit_time).join(", ")}
                                        </Typography>
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                <Box maxWidth="xl">
                    <Link>
                        <Typography variant="h6" sx={{ color: "#C32F27", fontWeight: "light", fontSize: "14px", textAlign: "center" }}>
                            Shorten Another Link
                        </Typography>
                    </Link>
                </Box>
            </Container>
        </Box>
    );
};

