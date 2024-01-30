
import { Box, Typography, Container } from "@mui/material";
import Icon from '@mdi/react';
import { mdiLinkCircleOutline } from '@mdi/js';
import { mdiQrcodeScan } from '@mdi/js';
import { mdiGoogleAnalytics } from '@mdi/js';
import { mdiHistory } from '@mdi/js';
import { Link } from "react-router-dom";
import Button from "./elements/Button";




const FeatureBox = ({ Icon, title, description }) => {
    const featureBoxStyle= {
      width: 320,
      height:200,
      margin: "10px",
      padding: "16px",
      backgroundColor: "#FDCFF3",
      color: "#000",
      cursor: "pointer",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "20px", 
    };
  
    const iconStyle = {
        display: "inline-block",
        marginRight: "10px",
      };

    const titleStyle = {
      fontSize: "1.2rem",
      fontWeight: "bold",
      marginLeft: "14px",
      marginTop: "8px",
      marginBottom: "5px",
      display: "inline"
    };
  
    const descriptionStyle = {
      textAlign: "justify",
      marginTop: "8px",
      
    };
  
    return (
      <>
        <div style={featureBoxStyle}>
            <div className="flex items-center">
                <Icon style={iconStyle} />
                <p style={titleStyle}>{title}</p>
            </div>
          <div className="features_desc">
            <small style={descriptionStyle}>{description}</small>
          </div>
        </div>
      </>
    );
  };
  
export default FeatureBox;

export const Feature = () => {
    return(
        <>
            <div>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            className="inline pl-8 text-white"
            align="center"
            sx={{
              fontWeight: "bold",
              marginTop: 6,
              marginBottom: 3,
            }}>
                What Does <span>
                    <Typography
                    variant="h2"
                    className="inline text-pee"
                    sx={{
                        fontWeight: "bold"
                    }}>
                        Scissor
                    </Typography></span> Offer?
          </Typography>
          <Box maxWidth="xl"  className="mx-auto mt-4 mb-10">
                <Typography variant="h6" sx={{ fontSize:"16px", fontWeight:"light" }} paragraph className="w-full text-white">
                    Scissor allows you to shorten URLs by pasting a long URL into the it&apos;s
                    platform and a shorter URL gets automatically generated. The shortened URL
                    is designed to be as short as possible, making it easy to share on social
                    media or through other channels.
                </Typography>
            </Box>
        </Container>

        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "20px", 
            }}
            >
            <Box maxWidth="sm">
                <FeatureBox
                Icon={() => <Icon path={mdiLinkCircleOutline} size={1} />}
                title="Custom URLs"
                description="Customize their shortened URLs. You can choose their own custom
                domain name and customize the URL to reflect your brand or content."
                />
            </Box>
            <Box maxWidth="sm">
                <FeatureBox
                Icon={() => <Icon path={mdiQrcodeScan} size={1}/>}
                title="QR Code Generator"
                description="Generate QR codes for the shortened URLs. You can download
                the QR code image and use it in your promotional materials or/and on your website."
                />
            </Box>
            <Box maxWidth="sm">
                <FeatureBox
                Icon={() => <Icon path={mdiGoogleAnalytics} size={1}/>}
                title="Analytics"
                description="Basic analytics that allow users to track their shortened URL's performance."
                />
            </Box>
            <Box maxWidth="sm">
                <FeatureBox
                Icon={() => <Icon path={mdiHistory} size={1}/>}
                title="Link History"
                description="See the history of links they've created so they can easily find and reuse links they have previously created"
                />
            </Box>
            </Container>
                <Box maxWidth="xl" className="pl-6 text-center mt-10">
                    <Link to="/shorten-link">
                        <Button className="mt-4 text-white">Shorten Your Link</Button>
                    </Link>
                </Box>
            </div>
        </>
    );
};

