import React from "react";
import {CircularProgress, styled} from "@mui/material";

const CircularProgressWrapper = styled('div')(({theme}) => ({
    width: "100%",
    display: "flex",
    flexDirection: "center",
    justifyContent: "center",
    padding: "2em",
    minHeight: "86px"
}));

const Loader = () => {

    return (
        <CircularProgressWrapper>
            <CircularProgress/>
        </CircularProgressWrapper>
    );
}

export default Loader;
