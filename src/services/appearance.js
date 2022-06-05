import {createTheme} from "@mui/material/styles";
import colors from '../UIKit/scss/global/_palette.scss';

export const defaultTheme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#ff6e40',
            light: '#fbe9e7',
        },
        secondary: {
            main: '#7c4dff',
            light: '#d1c4e9',
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

        dark: {
            main: '#616161',
        },
    },
});