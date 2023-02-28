import React from "react";

import PropTypes from "prop-types";

import {Box, Button, ButtonGroup} from "@mui/material";

import authProviders from "../../data/auth-providers";

const AuthProviderList = (props) => {
    // Properties
    const {gutterBottom, gutterTop, performingAction} = props;

    // Events
    const {onAuthProviderClick} = props;

    return (
        <Box mb={gutterBottom ? 3 : 0} mt={gutterTop ? 3 : 0}>
            <ButtonGroup
                disabled={performingAction}
                fullWidth
                orientation="vertical"
                variant="outlined"
            >
                {authProviders.map((authProvider) => {
                    return (
                        <Button sx={{color: authProvider.color}}
                                key={authProvider.id}
                                startIcon={authProvider.icon}
                                onClick={() => onAuthProviderClick(authProvider)}
                        >
                            {authProvider.name}
                        </Button>
                    );
                })}
            </ButtonGroup>
        </Box>
    );
};

AuthProviderList.defaultProps = {
    gutterTop: false,
    gutterBottom: false,
    performingAction: false,
};

AuthProviderList.propTypes = {
    // Properties
    gutterTop: PropTypes.bool,
    gutterBottom: PropTypes.bool,
    performingAction: PropTypes.bool,

    // Events
    onAuthProviderClick: PropTypes.func.isRequired,
};

export default AuthProviderList;
