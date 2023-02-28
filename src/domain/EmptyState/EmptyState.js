import React from "react";
import PropTypes from "prop-types";

import {Box, Typography} from "@mui/material";

function EmptyState(props) {
    let imageWidth;
    let imageHeight;
    let variant;

    switch (props.size) {
        case "small":
            imageWidth = 40;
            imageHeight = 40;
            variant = "h6";
            break;

        case "medium":
            imageWidth = 50;
            imageHeight = 50;
            variant = "h6";
            break;

        case "large":
            imageWidth = 100;
            imageHeight = 100;
            variant = "h4";
            break;

        default:
            imageWidth = 60;
            imageHeight = 60;
            variant = "h5";
            break;
    }

    if (props.type === "page") {
        return (
            <Box sx={{margin: "auto", padding: "2em 4em", ...props?.sx}} textAlign="center"
            >
                {props.image && (
                    <Box
                        clone
                        style={{margin: "auto", marginBottom: props.title || props.description ? 2 : 0}}
                        width={`${imageWidth}%`}
                        height={`${imageHeight}%`}
                    >
                        <props.image.type style={{width: "100%", height: "100%", margin: "auto"}}/>
                    </Box>
                )}

                {props.title && (
                    <Box mb={!props.description && props.button ? 2 : 0.5}>
                        <Typography variant="h4">{props.title}</Typography>
                    </Box>
                )}

                {props.description && (
                    <Box mb={props.button && 3}>
                        <Typography variant="h5">{props.description}</Typography>
                    </Box>
                )}

                {props.button && props.button}
            </Box>
        );
    }

    if (props.type === "card") {
        return (
            <Box padding={props.padding} textAlign="center">
                {props.image && (
                    <Box
                        clone
                        mb={props.title || props.description ? 2 : 0}
                        width={`${imageWidth}%`}
                        height={`${imageHeight}%`}
                    >
                        {props.image}
                    </Box>
                )}

                {props.title && (
                    <Box mb={!props.description && props.button ? 2 : 0}>
                        <Typography variant={variant}>{props.title}</Typography>
                    </Box>
                )}

                {props.description && (
                    <Box mb={props.button && 2}>
                        <Typography variant="body1">{props.description}</Typography>
                    </Box>
                )}

                {props.button && props.button}
            </Box>
        );
    }

    return null;
}

EmptyState.defaultProps = {
    type: "page",
    size: "medium",
    padding: 2,
};

EmptyState.propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    padding: PropTypes.number,

    image: PropTypes.element,
    title: PropTypes.string,
    description: PropTypes.string,
    button: PropTypes.element,
};

export default EmptyState;
