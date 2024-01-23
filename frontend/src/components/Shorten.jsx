import { Box, Card, Typography, Grid, Container } from "@mui/material";
import Button from "./elements/Button";



export const Shorten = () => {
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
                                    <form className="my-4 w-full">
                                        <Box sx={{ display:"flex", justifyContent: "center", alignItems:"center" }}>
                                            <Box className="flex items-center gap-2 mx-auto">
                                                <input className=" shadow appearance-none border bg-[#FAF2A1] rounded py-2 px-14 mx-auto
                                                text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                                                type="text" id="phone" required value="" placeholder="Paste your link here"/>   
                                                <Box className="flex justify-center">
                                                    <Button className="mt-[-1%] text-white font-light py-2 px-3 rounded">
                                                        Shorten Link
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                </form>      
                                </Card>
                            </Grid>
                        </Grid>         
                    </Box>
               
            </Container>
        </Box>
    )
}