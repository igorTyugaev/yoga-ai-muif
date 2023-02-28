import React, {useState} from "react";
import {Link as RouterLink, useHistory} from "react-router-dom";
import GitHubIcon from '@mui/icons-material/GitHub';

import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    ButtonGroup,
    Button,
    IconButton,
    Divider,
    Menu,
    MenuItem,
    Link, Grid, styled
} from "@mui/material";

import UserAvatar from "../UserAvatar";
import {useAppContext} from "../../AppContext";
import Logo from "../../Assets/logo_text.svg";

const LogoImg = styled('img')(({theme}) => ({
    objectFit: 'contain',
    objectPosition: 'center',
    height: '36px',
    paddingTop: '5px'
}));

const Bar = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const appContext = useAppContext();

    const openMenu = (event) => {
        const anchorEl = event.currentTarget;
        setAnchorEl(anchorEl);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    // Properties
    const {performingAction, user, userData, roles} = appContext;

    // Functions
    const {openDialog} = appContext;

    // Events
    const onAboutClick = () => openDialog("aboutDialog"),
        onSettingsClick = () => openDialog("settingsDialog"),
        onSignOutClick = () => openDialog("signOutDialog"),
        onSignUpClick = () => openDialog("signUpDialog"),
        onSignInClick = () => openDialog("signInDialog");

    const menuItems = [
        {
            name: "Мой профиль",
            to: user ? `/user/${user.uid}` : null,
        },
        {
            name: "Настройки",
            onClick: onSettingsClick,
        },
        {
            name: "О приложении",
            onClick: onAboutClick,
        },
        {
            name: "Выйти",
            divide: true,
            onClick: onSignOutClick,
        },
    ];

    //sx={{backgroundColor: 'rgb(112, 104, 212, 0.36)', boxShadow: 'none'}}
    return (
        <AppBar color="transparent" position="static"
                sx={{borderBottom: '1px solid rgb(238, 238, 238)', boxShadow: 'none'}}>
            <Toolbar>
                <Box display="flex" flexGrow={1}>
                    <Link
                        color="inherit"
                        component={RouterLink}
                        to="/"
                        underline="none"
                    >
                        <LogoImg src={Logo} alt="YogaAI"/>
                    </Link>
                </Box>

                <Box display="flex" flexGrow={0} sx={{marginLeft: '12px'}}>
                    <a href="https://github.com/igorTyugaev/yoga-ai-muif" target="_blank">
                        <IconButton>
                            <GitHubIcon color="primary"/>
                        </IconButton>
                    </a>
                </Box>

                {user && (
                    <>
                        <Button
                            color="inherit"
                            disabled={performingAction}
                            onClick={openMenu}
                            size="large">
                            <Grid container direction="row" alignItems="center" spacing={2}>
                                <Grid item>
                                    <UserAvatar user={Object.assign(user, userData)}/>
                                </Grid>
                                <Grid item>
                                    <Typography color="inherit" variant="subtitle1">
                                        {userData?.fullName}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Button>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={closeMenu}
                            sx={{padding: '0 24px'}}
                        >
                            {menuItems.map((menuItem, index) => {
                                if (
                                    menuItem.hasOwnProperty("condition") &&
                                    !menuItem.condition
                                ) {
                                    return null;
                                }

                                let component = null;

                                if (menuItem.to) {
                                    component = (
                                        <MenuItem
                                            key={index}
                                            component={RouterLink}
                                            to={menuItem.to}
                                            onClick={closeMenu}
                                        >
                                            {menuItem.name}
                                        </MenuItem>
                                    );
                                } else {
                                    component = (
                                        <MenuItem
                                            key={index}
                                            onClick={() => {
                                                closeMenu();

                                                menuItem.onClick();
                                            }}
                                        >
                                            {menuItem.name}
                                        </MenuItem>
                                    );
                                }

                                if (menuItem.divide) {
                                    return (
                                        <span key={index}>
                        <Divider/>

                                            {component}
                      </span>
                                    );
                                }

                                return component;
                            })}
                        </Menu>
                    </>
                )}

                {!user && (
                    <ButtonGroup
                        color="inherit"
                        disabled={performingAction}
                        variant="outlined"
                    >
                        <Button onClick={onSignUpClick}>Регистрация</Button>
                        <Button onClick={onSignInClick}>Войти</Button>
                    </ButtonGroup>
                )}
            </Toolbar>
        </AppBar>
    );

}

export default Bar;
