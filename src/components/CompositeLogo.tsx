import {Container, Typography, useMediaQuery, useTheme} from "@mui/material";
import {observer} from "mobx-react";
import React from "react";

const CompositeLogo: React.FC<{mode?: "vertical" | "horizontal"}> = ({mode}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        (!mode || mode === "horizontal") ?
            // Horizontal form
            <Container
                maxWidth="md"
                sx={{
                    display: "flex",
                    width: "100%",
                    maxHeight: { xs: "50px", lg: "100px" },
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {isMobile ? 
                    <img
                        src="logo2.png"
                        style={{
                            height: "100%",
                            width: "20%",
                            transform: "translate(-25%, 5%)",
                            marginRight: "-2em",
                        }}
                        alt="TEE BOX"
                    /> : <img
                        src="logo2.png"
                        style={{
                            height: "100%",
                            width: "20%",
                            transform: "translate(-22%, 5%)",
                            marginRight: "-4em",
                        }}
                        alt="TEE BOX"
                    /> 
                }
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        // fontSize: { xs: "25px", lg: "35px" },
                        lineHeight: { xs: "1em", lg: "1em" },
                        textAlign: "left",
                        letterSpacing: "0px",
                        textTransform: "uppercase",
                    }}
                >
                    TEE BOX League
                </Typography>
            </Container>
            
            :

            // Vertical form
            <React.Fragment>
                <Container
                    maxWidth="sm"
                    sx={{
                        width: {xs: "100%", lg: "130%"},
                        marginBottom: {xs: "-40px", lg: "-15%"},
                        marginLeft: {xs: "unset", lg: "-15%"}
                    }}
                >
                    <img src="logo2.png" style={{width: "100%"}} alt="TEE BOX" />
                </Container>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        fontSize: {xs: "85px", lg: "100px"},
                        lineHeight: {xs: "70px", lg: "80px"},
                        textAlign: "center",
                        letterSpacing: "-6px",
                        textTransform: "uppercase",
                    }}
                >
                    TEE BOX League
                </Typography>
            </React.Fragment>
    );
};

export default observer(CompositeLogo);