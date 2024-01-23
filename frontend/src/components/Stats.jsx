import { Box, Card, Typography, Grid, Container } from "@mui/material";
import Button from "./elements/Button";
import { Link } from "react-router-dom";



export const Stats = () => {
    return(
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
                }}>
                    Track Your  URLs <span>
                        <Typography
                        variant="h2"
                        className="inline"
                        sx={{
                            color:"#C32F27",
                            fontWeight: "bold"
                        }}>
                            Short
                        </Typography></span> Here
            </Typography>
                <Box maxWidth="xl"  className="mx-auto mt-4 mb-6 w-full">
                    <Grid maxWidth="xl">
                        <Grid>
                            <Typography variant="h6" sx={{ fontSize:"16px", fontWeight:"light", margin:"auto" }} paragraph className="w-full text-center pb-2">
                                Enter the URL to find out how many clicks it has received so far. Example: rb.gy/pjzjsl
                            </Typography>
                        </Grid>
                        <Grid maxWidth="xl" className="mx-auto w-full">
                            <Card className="shadow appearance-none mt-2" sx={{ backgroundColor:"transparent"}}>
                                <form className="my-4 w-full">
                                    <Box sx={{ display:"flex", justifyContent: "center", alignItems:"center" }}>
                                        <Box className="flex items-center gap-2 mx-auto">
                                            <input className=" shadow appearance-none border bg-[#FAF2A1] rounded py-2 px-14 mx-auto
                                            text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text" id="phone" required value="" placeholder="Enter Your teeny link here"/>   
                                            <Box className="flex justify-center">
                                                <Button className="mt-[-1%] text-white font-light py-2 px-3 rounded">
                                                    View Clicks
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                            </form>      
                            </Card>
                        </Grid>
                    </Grid>
                    
                </Box>
                <Box maxWidth="xl">
                    <Link>
                        <Typography variant="h6" 
                        sx={{color:"#C32F27", fontWeight: "light", fontSize: "14px", textAlign:"center"}}>
                            Shorten Another Link
                        </Typography>
                    </Link>
                </Box>
                </Container>
            {/* <Container>
            <Box maxWidth="xl" sx={{ display:"flex", alignItems:"center", justifyContent:"center" }} className="">
                <Grid>
                    <Box maxWidth="sm" className="ms-14 mt-8 border border-1 w-full">
                        <Card className="shadow appearance-none bg-transparent">
                            <img
                                src=""
                                alt="Preview"
                                width={120}
                                height={120}
                                className="h-40 w-40 object-contain mt-4 mx-auto"
                            />
                        </Card>
                        <Box className="text-center">
                            <Button  className="my-8 text-white font-light py-2 px-4 rounded">
                                <span><Icon path={mdiTrayArrowDown} size={1} className="inline" /></span>
                                &emsp; Download
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Box>
            </Container> */}
        </Box>
    )
}