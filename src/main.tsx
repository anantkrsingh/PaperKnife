import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CssBaseline, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material'

let muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#ef476f' },
    secondary: { main: '#06b6d4' },
    background: {
      default: '#f7f9ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(180deg, #f7f9ff 0%, #fff7fb 100%)',
          color: '#111827',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
  },
})

muiTheme = responsiveFontSizes(muiTheme)

// Bug Sniffer: Show errors on Android screen
window.onerror = function(msg, _url, line, _col, error) {
  alert("ERROR: " + msg + "\nLine: " + line + "\n" + error);
  return false;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
