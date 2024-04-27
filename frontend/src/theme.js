// theme.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
    spacing: 8, // Set default spacing unit (8px)
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});
theme = responsiveFontSizes(theme);

export default theme;
