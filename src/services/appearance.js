import {createTheme} from "@mui/material/styles";

export const defaultTheme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#7068d4',
            light: '#e0dfff',
        },
        secondary: {
            main: '#ff4438',
        },
        error: {
            main: '#d8385e',
        },
        warning: {
            main: '#ff874c',
        },
        success: {
            main: '#1d856c',
        },
        info: {
            main: '#ffb0a7',
        },
    },
});