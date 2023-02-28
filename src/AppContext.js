import React, {Component, createContext, useContext} from 'react';
import {defaultTheme} from "./services/appearance";
import UserService from "./services/UserService";
import readingTime from "reading-time";
import {auth, firestore} from "./firebase";

const AppContext = createContext();
const initialState = {
    ready: false,
    performingAction: false,
    theme: defaultTheme,
    user: null,
    userData: null,
    roles: [],

    aboutDialog: {
        open: false,
    },

    reviewDialog: {
        open: false,
    },

    signUpDialog: {
        open: false,
    },

    signInDialog: {
        open: false,
    },

    settingsDialog: {
        open: false,
    },

    deleteAccountDialog: {
        open: false,
    },

    signOutDialog: {
        open: false,
    },

    snackbar: {
        autoHideDuration: 0,
        message: "",
        open: false,
    },
};

class AppProvider extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    resetState = (callback) => {
        this.setState(
            {
                ready: true,
                theme: defaultTheme,
                user: null,
                userData: null,
                roles: [],
            },
            callback
        );
    };


    openDialog = (dialogId, callback) => {
        const dialog = this.state[dialogId];

        if (!dialog || dialog.open === undefined || null) {
            return;
        }

        dialog.open = true;

        this.setState({dialog}, callback);
    };

    closeDialog = (dialogId, callback) => {
        const dialog = this.state[dialogId];

        if (!dialog || dialog.open === undefined || null) {
            return;
        }

        dialog.open = false;

        this.setState({dialog}, callback);
    };

    closeAllDialogs = (callback) => {
        this.setState(
            {
                aboutDialog: {
                    open: false,
                },

                reviewDialog: {
                    open: false,
                },

                signUpDialog: {
                    open: false,
                },

                signInDialog: {
                    open: false,
                },

                settingsDialog: {
                    open: false,
                },

                deleteAccountDialog: {
                    open: false,
                },

                signOutDialog: {
                    open: false,
                },
            },
            callback
        );
    };

    deleteAccount = () => {
        this.setState(
            {
                performingAction: true,
            },
            () => {
                UserService
                    .deleteAccount()
                    .then(() => {
                        this.closeAllDialogs(() => {
                            this.openSnackbar("Deleted account");
                        });
                    })
                    .catch((reason) => {
                        const code = reason.code;
                        const message = reason.message;

                        switch (code) {
                            default:
                                this.openSnackbar(message);
                                return;
                        }
                    })
                    .finally(() => {
                        this.setState({
                            performingAction: false,
                        });
                    });
            }
        );
    };

    signOut = () => {
        this.setState(
            {
                performingAction: true,
            },
            () => {
                UserService
                    .signOut()
                    .then(() => {
                        this.closeAllDialogs(() => {
                            this.openSnackbar("Вышли");
                        });
                    })
                    .catch((reason) => {
                        const code = reason.code;
                        const message = reason.message;

                        switch (code) {
                            default:
                                this.openSnackbar(message);
                                return;
                        }
                    })
                    .finally(() => {
                        this.setState({
                            performingAction: false,
                        });
                    });
            }
        );
    };

    openSnackbar = (message, autoHideDuration = 2, callback) => {
        this.setState(
            {
                snackbar: {
                    autoHideDuration: readingTime(message).time * autoHideDuration,
                    message,
                    open: true,
                },
            },
            () => {
                if (callback && typeof callback === "function") {
                    callback();
                }
            }
        );
    };

    closeSnackbar = (clearMessage = false) => {
        const {snackbar} = this.state;

        this.setState({
            snackbar: {
                message: clearMessage ? "" : snackbar.message,
                open: false,
            },
        });
    };

    render() {
        const {children} = this.props;

        const {
            openDialog,
            closeDialog,
            deleteAccount,
            signOut,
            openSnackbar,
            closeSnackbar
        } = this;

        return <AppContext.Provider value={{
            ...this.state,
            openDialog,
            closeDialog,
            deleteAccount,
            signOut,
            openSnackbar,
            closeSnackbar
        }}>
            {children}
        </AppContext.Provider>
    }

    componentDidMount() {
        this.onAuthStateChangedObserver = auth.onAuthStateChanged(
            (user) => {
                if (!user || !user.uid) {
                    if (this.userDocumentSnapshotListener) {
                        this.userDocumentSnapshotListener();
                    }

                    this.resetState();

                    return;
                }

                this.userDocumentSnapshotListener = firestore
                    .collection("users")
                    .doc(user.uid)
                    .onSnapshot(
                        (snapshot) => {
                            const data = snapshot.data();

                            if (!snapshot.exists || !data) {
                                UserService.setAvatar(user.photoURL).then().catch().finally();
                                return;
                            }

                            UserService
                                .getRoles()
                                .then((value) => {
                                    this.setState({
                                        ready: true,
                                        user: user,
                                        userData: data,
                                        roles: value || [],
                                    });
                                })
                                .catch((reason) => {
                                    this.resetState(() => {
                                        const code = reason.code;
                                        const message = reason.message;

                                        switch (code) {
                                            default:
                                                this.openSnackbar(message);
                                                return;
                                        }
                                    });
                                });
                        },
                        (error) => {
                            this.resetState(() => {
                                const code = error.code;
                                const message = error.message;

                                switch (code) {
                                    default:
                                        this.openSnackbar(message);
                                        return;
                                }
                            });
                        }
                    );
            },
            (error) => {
                this.resetState(() => {
                    const code = error.code;
                    const message = error.message;

                    switch (code) {
                        default:
                            this.openSnackbar(message);
                            return;
                    }
                });
            }
        );
    }

    componentWillUnmount() {
        if (this.onAuthStateChangedObserver) {
            this.onAuthStateChangedObserver();
        }

        if (this.userDocumentSnapshotListener) {
            this.userDocumentSnapshotListener();
        }
    }
}

export const useAppContext = () => useContext(AppContext);
export default AppProvider;
