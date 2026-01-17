import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9a8568',
      light: '#b39d7d',
      dark: '#7d6a54',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c4b299',
      light: '#d1c2aa',
      dark: '#b39d7d',
    },
    accent: {
      main: '#d4a574',
      light: '#e0c19a',
      dark: '#b88a5a',
    },
    success: {
      main: '#6b8e5a',
      light: '#8ba87a',
      dark: '#557045',
    },
    error: {
      main: '#c97d60',
      light: '#d99a82',
      dark: '#b06245',
    },
    info: {
      main: '#7a9cc6',
      light: '#9bb5d9',
      dark: '#5d7ba3',
    },
    background: {
      default: '#f5f1eb',
      paper: '#faf8f5',
    },
    text: {
      primary: '#655845',
      secondary: '#7d6a54',
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 600,
      color: '#5d5245',
    },
    h5: {
      fontWeight: 600,
      color: '#5d5245',
    },
    h6: {
      fontWeight: 600,
      color: '#726657',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 20px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(154, 133, 104, 0.2)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #9a8568 0%, #b39d7d 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8a7560 0%, #a38d6d 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(101, 88, 69, 0.08), 0 2px 4px rgba(101, 88, 69, 0.04)',
          border: '1px solid rgba(212, 165, 116, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(101, 88, 69, 0.12), 0 4px 8px rgba(101, 88, 69, 0.06)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
