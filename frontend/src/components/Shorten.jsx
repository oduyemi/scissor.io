import React, { useState } from "react";
import { Box, Card, Typography, Grid, Container } from "@mui/material";
import Button from "./elements/Button";
import axios from "axios";



export const Shorten = () => {
    const [originalUrl, setOriginalUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleShorten = async () => {
        try {
            setLoading(true);
            const response = await axios.post("http://127.0.0.1:8000/an", { url: originalUrl });

            const responseData = response.data;

            if (response.status === 200) {
                console.log('Success:', responseData);
                setShortenedUrl(responseData.shortened_url);
            } else {
                console.error('Error:', responseData);
                setShortenedUrl('');
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
            setShortenedUrl('');
            alert(`Error shortening URL: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
        

        const handleFormSubmit = (e) => {
            e.preventDefault();
            handleShorten();
          };
          
          
    return(
        <Box className="container my-14 mx-auto md:px-6">
            <Container maxWidth="md" className="mt-14">
                <Typography
                    variant="h2"
                    className="inline link mt-8"
                    align="center"
                    sx={{
                    fontWeight: "bold",
                    marginTop: 6,
                    marginBottom: 3,
                    }}>
                        Shorten Your <span>
                            <Typography
                            variant="h2"
                            className="inline"
                            sx={{
                                color:"#C32F27",
                                fontWeight: "bold"
                            }}>
                                Link
                            </Typography></span> Here
                </Typography>
                    <Box maxWidth="xl"  className="mx-auto mt-4 mb-6 w-full">
                        <Grid maxWidth="xl">
                            <Grid>
                                <Typography variant="h6" sx={{ fontSize:"16px", fontWeight:"light", margin:"auto" }} paragraph className="w-full text-center pb-2">
                                    Paste the URL in the box below and shorten your link. 
                                </Typography>
                            </Grid>
                            <Grid maxWidth="xl" className="mx-auto w-full">
                                <Card className="shadow appearance-none mt-2" sx={{ backgroundColor:"transparent"}}>
                                    <form className="my-4 w-full" onSubmit={handleFormSubmit}>
                                        <Box sx={{ display:"flex", justifyContent: "center", alignItems:"center" }}>
                                            <Box className="flex items-center gap-2 mx-auto">
                                                <input className=" shadow appearance-none border bg-[#FAF2A1] rounded py-2 px-14 mx-auto
                                                text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                                                type="text"
                                                name="phone"
                                                required value={originalUrl}
                                                onChange={(e) => setOriginalUrl(e.target.value)}
                                                placeholder="Paste your link here"/>   
                                                <Box className="flex justify-center">
                                                    <Button
                                                        className="mt-[-1%] text-white font-light py-2 px-3 rounded"
                                                        onClick= {handleShorten}
                                                        disabled={loading}>
                                                        {loading ? "Hang on..." : "Shorten Link"}                                                
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                </form>  
                                {shortenedUrl && (
                                    <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontSize: '16px', fontWeight: 'light', margin: 'auto' }}
                                        paragraph
                                        className="w-full text-center pb-2">
                                        Shortened URL: {shortenedUrl}
                                    </Typography>
                                    </Box>
                                )}    
                                </Card>
                            </Grid>
                        </Grid>         
                    </Box>
               
            </Container>
        </Box>
    )
}