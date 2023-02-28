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
    TextField,
    styled,
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


const SignUpDialog = (props) => {
    // Dialog Properties
    const {dialogProps} = props;
    const [performingAction, setPerformingAction] = useState(false);
    const [emailAddress, setEmailAddress] = useState("");
    const [emailAddressConfirmation, setEmailAddressConfirmation] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState(null);

    const signUp = () => {
        const errors = validate(
            {
                emailAddress: emailAddress,
                emailAddressConfirmation: emailAddressConfirmation,
                password: password,
                passwordConfirmation: passwordConfirmation,
            },
            {
                emailAddress: constraints.emailAddress,
                emailAddressConfirmation: constraints.emailAddressConfirmation,
                password: constraints.password,
                passwordConfirmation: constraints.passwordConfirmation,
            }
        );

        if (errors) {
            setErrors(errors);
        } else {
            setErrors(null);
            setPerformingAction(true);
            UserService
                .signUpWithEmailAddressAndPassword(emailAddress, password)
                .then((value) => {
                    props.dialogProps.onClose();
                })
                .catch((reason) => {
                    const code = reason.code;
                    const message = reason.message;

                    switch (code) {
                        case "auth/email-already-in-use":
                        case "auth/invalid-email":
                        case "auth/operation-not-allowed":
                        case "auth/weak-password":
                            props.openSnackbar(message);
                            return;

                        default:
                            props.openSnackbar(message);
                            return;
                    }
                })
                .finally(() => {
                    setPerformingAction(false);
                });
        }
    };

    const signInWithAuthProvider = (provider) => {
        setPerformingAction(true);
        UserService
            .signInWithAuthProvider(provider)
            .then((user) => {
                props.dialogProps.onClose(() => {
                    const displayName = user.displayName;
                    const emailAddress = user.email;

                    props.openSnackbar(
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
                        props.openSnackbar(message);
                        return;

                    default:
                        props.openSnackbar(message);
                        return;
                }
            })
            .finally(() => {
                setPerformingAction(false);
            });
    };

    const handleKeyPress = (event) => {
        if (
            !emailAddress ||
            !emailAddressConfirmation ||
            !password ||
            !passwordConfirmation
        ) {
            return;
        }

        const key = event.key;

        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }

        if (key === "Enter") {
            signUp();
        }
    };

    const handleExited = () => {
        setPerformingAction(false);
        setEmailAddress("");
        setEmailAddressConfirmation("");
        setPassword("");
        setPasswordConfirmation("");
        setErrors(null);
    };

    const handleEmailAddressChange = (event) => {
        const emailAddress = event.target.value;
        setEmailAddress(emailAddress);
    };

    const handleEmailAddressConfirmationChange = (event) => {
        const emailAddressConfirmation = event.target.value;
        setEmailAddressConfirmation(emailAddressConfirmation);
    };

    const handlePasswordChange = (event) => {
        const password = event.target.value;
        setPassword(password);
    };

    const handlePasswordConfirmationChange = (event) => {
        const passwordConfirmation = event.target.value;
        setPasswordConfirmation(passwordConfirmation);
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
                <Typography variant="span">Зарегистрируйте аккаунт</Typography>

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
                <Grid container direction="column" spacing={2}>
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
                            autoComplete="email"
                            disabled={performingAction}
                            error={!!(errors && errors.emailAddressConfirmation)}
                            fullWidth
                            helperText={
                                errors && errors.emailAddressConfirmation
                                    ? errors.emailAddressConfirmation[0]
                                    : ""
                            }
                            label="Подтверждение E-mail адреса"
                            placeholder="simple@mail.com"
                            required
                            type="email"
                            value={emailAddressConfirmation}
                            variant="outlined"
                            InputLabelProps={{required: false}}
                            onChange={handleEmailAddressConfirmationChange}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField
                            autoComplete="new-password"
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
                    <Grid item xs>
                        <TextField
                            autoComplete="password"
                            disabled={performingAction}
                            error={!!(errors && errors.passwordConfirmation)}
                            fullWidth
                            helperText={
                                errors && errors.passwordConfirmation
                                    ? errors.passwordConfirmation[0]
                                    : ""
                            }
                            label="Подтверждение пароля"
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            required
                            type="password"
                            value={passwordConfirmation}
                            variant="outlined"
                            InputLabelProps={{required: false}}
                            onChange={handlePasswordConfirmationChange}
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
                    disabled={
                        !emailAddress ||
                        !emailAddressConfirmation ||
                        !password ||
                        !passwordConfirmation ||
                        performingAction
                    }
                    variant="contained"
                    onClick={signUp}
                >
                    Продолжить
                </Button>
            </DialogActions>
        </Dialog>
    );
}

SignUpDialog.propTypes = {
    // Dialog Properties
    dialogProps: PropTypes.object.isRequired,

    // Custom Functions
    openSnackbar: PropTypes.func.isRequired,
};

export default SignUpDialog;
