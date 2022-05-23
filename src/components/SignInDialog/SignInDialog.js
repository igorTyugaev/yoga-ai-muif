import React, {useState} from "react";
import PropTypes from "prop-types";
import validate from "validate.js";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Tooltip,
    IconButton,
    Grid,
    Button,
    styled, TextField,
} from "@mui/material";

import {Close as CloseIcon} from "@mui/icons-material";

import AuthProviderList from "../AuthProviderList";

import constraints from "../../data/constraints";
import UserService from "../../services/UserService";

const CloseButton = styled(IconButton)(({theme}) => ({
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
}));

const SignInDialog = ({dialogProps, openSnackbar}) => {
    const [performingAction, setPerformingAction] = useState(false);
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState(null);

    const getSignInButton = () => {
        if (emailAddress && !password) {
            return (
                <Button
                    color="primary"
                    disabled={!emailAddress || performingAction}
                    variant="contained"
                    onClick={() => sendSignInLinkToEmail()}
                >
                    Отправить ссылку для входа
                </Button>
            );
        }

        return (
            <Button
                color="primary"
                disabled={!emailAddress || performingAction}
                variant="contained"
                onClick={() => signIn()}
            >
                Войти
            </Button>
        );
    };

    const resetPassword = () => {
        const errors = validate(
            {
                emailAddress: emailAddress,
            },
            {
                emailAddress: constraints.emailAddress,
            }
        );

        if (errors) {
            setErrors(errors);
        } else {
            setErrors(null);
            setPerformingAction(true);
            UserService
                .resetPassword(emailAddress)
                .then((value) => {
                    openSnackbar(
                        `Письмо для сброса пароля отправлено на адрес ${emailAddress}`
                    );
                })
                .catch((reason) => {
                    const code = reason.code;
                    const message = reason.message;

                    switch (code) {
                        case "auth/invalid-email":
                        case "auth/missing-android-pkg-name":
                        case "auth/missing-continue-uri":
                        case "auth/missing-ios-bundle-id":
                        case "auth/invalid-continue-uri":
                        case "auth/unauthorized-continue-uri":
                        case "auth/user-not-found":
                            openSnackbar(message);
                            return;

                        default:
                            openSnackbar(message);
                            return;
                    }
                })
                .finally(() => {
                    setPerformingAction(false);
                });

        }
    }

    const signIn = () => {
        const errors = validate(
            {
                emailAddress: emailAddress,
                password: password,
            },
            {
                emailAddress: constraints.emailAddress,
                password: constraints.password,
            }
        );

        if (errors) {
            setErrors(errors);
        } else {
            setPerformingAction(true);
            setErrors(null);
            UserService
                .signIn(emailAddress, password)
                .then((user) => {
                    dialogProps.onClose(() => {
                        const displayName = user.displayName;
                        const emailAddress = user.email;

                        openSnackbar(
                            `Вы вошли как ${displayName || emailAddress}`
                        );
                    });
                })
                .catch((reason) => {
                    const code = reason.code;
                    const message = reason.message;

                    switch (code) {
                        case "auth/invalid-email":
                        case "auth/user-disabled":
                        case "auth/user-not-found":
                        case "auth/wrong-password":
                            openSnackbar(message);
                            return;

                        default:
                            openSnackbar(message);
                            return;
                    }
                })
                .finally(() => {
                    setPerformingAction(false)
                });
        }
    }

    const sendSignInLinkToEmail = () => {

        const errors = validate(
            {
                emailAddress: emailAddress,
            },
            {
                emailAddress: constraints.emailAddress,
            }
        );

        if (errors) {
            setErrors(errors);
            return;
        }

        setPerformingAction(true);
        setErrors(null);
        UserService
            .sendSignInLinkToEmail(emailAddress)
            .then(() => {
                dialogProps.onClose(() => {
                    openSnackbar(`Письмо для входа отправлено на адрес ${emailAddress}`);
                });
            })
            .catch((reason) => {
                const code = reason.code;
                const message = reason.message;

                switch (code) {
                    case "auth/argument-error":
                    case "auth/invalid-email":
                    case "auth/missing-android-pkg-name":
                    case "auth/missing-continue-uri":
                    case "auth/missing-ios-bundle-id":
                    case "auth/invalid-continue-uri":
                    case "auth/unauthorized-continue-uri":
                        openSnackbar(message);
                        return;

                    default:
                        openSnackbar(message);
                        return;
                }
            })
            .finally(() => {
                setPerformingAction(false);
            });
    };

    const signInWithAuthProvider = (provider) => {
        setPerformingAction(true);
        UserService
            .signInWithAuthProvider(provider)
            .then((user) => {
                dialogProps.onClose(() => {
                    const displayName = user.displayName;
                    const emailAddress = user.email;

                    openSnackbar(
                        `Вы вошли как ${displayName || emailAddress}`
                    );
                });
            })
            .catch((reason) => {
                const code = reason.code;
                const message = reason.message;

                switch (code) {
                    case "auth/account-exists-with-different-credential":
                    case "auth/auth-domain-config-required":
                    case "auth/cancelled-popup-request":
                    case "auth/operation-not-allowed":
                    case "auth/operation-not-supported-in-this-environment":
                    case "auth/popup-blocked":
                    case "auth/popup-closed-by-user":
                    case "auth/unauthorized-domain":
                        openSnackbar(message);
                        return;

                    default:
                        openSnackbar(message);
                        return;
                }
            })
            .finally(() => {
                performingAction(false);
            });
    };

    const handleKeyPress = (event) => {

        if (!emailAddress && !password) {
            return;
        }

        const key = event.key;

        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }

        if (key === "Enter") {
            if (emailAddress && !password) {
                sendSignInLinkToEmail();
            } else {
                signIn();
            }
        }
    };

    const handleExited = () => {
        setPerformingAction(false);
        setEmailAddress("");
        setPassword("");
        setErrors(null);
    };

    const handleEmailAddressChange = (event) => {
        const emailAddress = event.target.value;
        setEmailAddress(emailAddress)
    };

    const handlePasswordChange = (event) => {
        const password = event.target.value;
        setPassword(password);
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            disableEscapeKeyDown={performingAction}
            {...dialogProps}
            onKeyPress={handleKeyPress}
            TransitionProps={{
                onExited: handleExited
            }}>
            <DialogTitle>
                <Typography variant="span">Войдите в свой аккаунт</Typography>

                <Tooltip title="Закрыть">
                    <CloseButton
                        disabled={performingAction}
                        onClick={dialogProps.onClose}
                        size="large">
                        <CloseIcon/>
                    </CloseButton>
                </Tooltip>
            </DialogTitle>

            <DialogContent>
                <Grid container direction="column" spacing={4}>
                    <Grid item xs sx={{marginTop: "0.5em"}}>
                        <TextField
                            autoComplete="email"
                            disabled={performingAction}
                            error={!!(errors && errors.emailAddress)}
                            fullWidth
                            helperText={
                                errors && errors.emailAddress ? errors.emailAddress[0] : ""
                            }
                            label="E-mail адрес"
                            placeholder="simple@mail.com"
                            required
                            type="email"
                            value={emailAddress}
                            variant="outlined"
                            InputLabelProps={{required: false}}
                            onChange={handleEmailAddressChange}
                        />
                    </Grid>

                    <Grid item xs>
                        <TextField
                            autoComplete="current-password"
                            disabled={performingAction}
                            error={!!(errors && errors.password)}
                            fullWidth
                            helperText={
                                errors && errors.password ? errors.password[0] : ""
                            }
                            label="Пароль"
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            required
                            type="password"
                            value={password}
                            variant="outlined"
                            InputLabelProps={{required: false}}
                            onChange={handlePasswordChange}
                        />
                    </Grid>
                </Grid>
                <AuthProviderList
                    gutterTop
                    performingAction={performingAction}
                    onAuthProviderClick={signInWithAuthProvider}
                />
            </DialogContent>

            <DialogActions>
                <Button
                    color="primary"
                    disabled={!emailAddress || performingAction}
                    variant="outlined"
                    onClick={resetPassword}
                >
                    Сбросить пароль
                </Button>

                {getSignInButton()}
            </DialogActions>
        </Dialog>
    );
}

SignInDialog.propTypes = {
    // Dialog Properties
    dialogProps: PropTypes.object.isRequired,

    // Custom Functions
    openSnackbar: PropTypes.func.isRequired,
};

export default SignInDialog;

