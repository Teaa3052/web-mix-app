import { createTheme, alpha } from '@mui/material/styles';
import background from '../images/background.jpg'; 

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#000000' },
    text: { primary: '#000000' },
    background: { default: '#ffffff' }, 
  },
  shape: {
    borderRadius: 25,
  },
  typography: {
    fontWeightBold: 800,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          border: '1px solid #ccc',
          backgroundColor: 'rgba(255,255,255,0.85)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          border: '1px solid #ccc',
          backgroundColor: 'rgba(255,255,255,0.85)',
        },
      },
    },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 50,
            textTransform: 'none',
            fontWeight: 700,
            transition: 'all 0.2s ease-in-out',
          },
          sizeSmall: {
            fontSize: '0.75rem',
            padding: '4px 12px',
          },
          sizeMedium: {
            fontSize: '0.95rem',
            padding: '8px 16px',
          },
          sizeLarge: {
            fontSize: '1.05rem',
            padding: '10px 20px',
          },
          outlined: ({ theme }) => ({
            borderWidth: 1,
            color: theme.palette.text.primary,
            borderColor: theme.palette.text.primary,
            '&:hover': {
              borderWidth: 1,
              boxShadow: `0 0 0 1px ${theme.palette.text.primary}`,
              backgroundColor: alpha(theme.palette.text.primary, 0.10),
            },
          }),
        },

      variants: [
        {
          
          props: { variant: 'compact' },
          style: ({ theme }) => ({
            fontSize: '0.85rem',           
            padding: '4px 12px',          
            borderRadius: 30,              
            borderWidth: 2,
            backgroundColor: '#fff',
            border: `1px solid ${theme.palette.text.primary}`,         boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: `0 0 0 1px ${theme.palette.text.primary}`,
              backgroundColor: alpha(theme.palette.text.primary, 0.10),
            },
          }),
        },
      ],
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '& input:-webkit-autofill': {
            boxShadow: '0 0 0 1000px #ffffff inset !important',
            WebkitTextFillColor: '#000 !important',
          },
        },
      },
    },
  },
});

theme = createTheme(theme, {
  typography: {
    h3: {
      fontWeight: 800,
      fontSize: '2.8rem',
      color: theme.palette.text.primary,
      [theme.breakpoints.down('md')]: {
        fontSize: '2.3rem',
      },
    },
    body1: {
      fontSize: '1.15rem',
      color: theme.palette.text.primary,
    },
    caption: {
      fontSize: '0.8rem',
      opacity: 0.8,
      color: theme.palette.text.primary,
    },
  },
});

export default theme;