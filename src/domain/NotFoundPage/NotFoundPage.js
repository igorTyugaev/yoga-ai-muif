import React, {Component} from "react";

import {Link} from "react-router-dom";

import {Fab, Box} from "@mui/material";

import {Home as HomeIcon} from "@mui/icons-material";

import EmptyState from "../EmptyState";

import {ReactComponent as NotFoundIllustration} from "../../illustrations/not-found.svg";

class NotFoundPage extends Component {
    render() {
        return (
            <EmptyState
                image={<NotFoundIllustration/>}
                title="Страницы не существует"
                description="Страница, к которой вы пытаетесь получить доступ, не существует."
                button={
                    <Fab variant="extended" color="primary" component={Link} to="/">
                        <Box clone mr={1}>
                            <HomeIcon/>
                        </Box>
                        На главную
                    </Fab>
                }
            />
        );
    }
}

export default NotFoundPage;
