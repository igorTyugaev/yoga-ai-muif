import React from "react";

import {ThemeProvider, StyledEngineProvider} from "@mui/material/styles";

import {CssBaseline, Button, Snackbar} from "@mui/material";
import AppRouter from "./AppRouter";
import DialogHost from "./components/DialogHost";
import ErrorBoundary from "./domain/ErrorBoundary";
import {useAppContext} from "./AppContext";
import LaunchScreen from "./pages/LaunchScreen";
import Bar from "./components/Bar";

const App = () => {
    // INFO: @mui/styles is not compatible with React.StrictMode or React 18.
    // TODO: Perform a full migration to emotion
    const appContext = useAppContext();
    const {
        ready,
        performingAction,
        theme,
        user,
        userData,
    } = appContext;

    const {
        aboutDialog,
        signUpDialog,
        signInDialog,
        settingsDialog,
        deleteAccountDialog,
        signOutDialog,
    } = appContext;

    const {snackbar} = appContext;
    const {
        openDialog,
        closeDialog,
        deleteAccount,
        signOut,
        openSnackbar,
        closeSnackbar
    } = appContext;

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <ErrorBoundary>
                    {!ready && <LaunchScreen/>}

                    {ready && (
                        <>
                            <AppRouter bar={
                                <Bar
                                    performingAction={performingAction}
                                    theme={theme}
                                    user={user}
                                    userData={userData}
                                    onSignUpClick={() => this.openDialog("signUpDialog")}
                                    onSignInClick={() => this.openDialog("signInDialog")}
                                    onAboutClick={() => this.openDialog("aboutDialog")}
                                    onSettingsClick={() => this.openDialog("settingsDialog")}
                                    onSignOutClick={() => this.openDialog("signOutDialog")}
                                />
                            }/>

                            <DialogHost
                                performingAction={performingAction}
                                theme={theme}
                                user={user}
                                userData={userData}
                                openSnackbar={openSnackbar}
                                dialogs={{
                                    aboutDialog: {
                                        dialogProps: {
                                            open: aboutDialog.open,

                                            onClose: () => closeDialog("aboutDialog"),
                                        },
                                    },

                                    signUpDialog: {
                                        dialogProps: {
                                            open: signUpDialog.open,

                                            onClose: (callback) => {
                                                closeDialog("signUpDialog");

                                                if (callback && typeof callback === "function") {
                                                    callback();
                                                }
                                            },
                                        },
                                    },

                                    signInDialog: {
                                        dialogProps: {
                                            open: signInDialog.open,

                                            onClose: (callback) => {
                                                closeDialog("signInDialog");

                                                if (callback && typeof callback === "function") {
                                                    callback();
                                                }
                                            },
                                        },
                                    },

                                    settingsDialog: {
                                        dialogProps: {
                                            open: settingsDialog.open,

                                            onClose: () => closeDialog("settingsDialog"),
                                        },

                                        props: {
                                            onDeleteAccountClick: () =>
                                                openDialog("deleteAccountDialog"),
                                        },
                                    },

                                    deleteAccountDialog: {
                                        dialogProps: {
                                            open: deleteAccountDialog.open,

                                            onClose: () => closeDialog("deleteAccountDialog"),
                                        },

                                        props: {
                                            deleteAccount: deleteAccount,
                                        },
                                    },

                                    signOutDialog: {
                                        dialogProps: {
                                            open: signOutDialog.open,

                                            onClose: () => closeDialog("signOutDialog"),
                                        },

                                        props: {
                                            title: "Уже уходите",
                                            contentText:
                                                "После выхода из системы вы не можете управлять своим профилем и выполнять другие действия, требующие входа в систему.",
                                            dismissiveAction: (
                                                <Button
                                                    color="primary"
                                                    onClick={() => closeDialog("signOutDialog")}
                                                >
                                                    Отмена
                                                </Button>
                                            ),
                                            confirmingAction: (
                                                <Button
                                                    color="primary"
                                                    disabled={performingAction}
                                                    variant="contained"
                                                    onClick={signOut}
                                                >
                                                    Выйти
                                                </Button>
                                            ),
                                        },
                                    },
                                }}
                            />

                            <Snackbar
                                autoHideDuration={snackbar.autoHideDuration}
                                message={snackbar.message}
                                open={snackbar.open}
                                onClose={closeSnackbar}
                            />
                        </>
                    )}
                </ErrorBoundary>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
