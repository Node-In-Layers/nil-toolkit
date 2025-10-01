import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: [
      'Lato',
      'sans-serif',
    ].join(',')
  },
  palette: {
    primary: {
      main: '#314730',
      light: '#314730',
    },
    secondary: {
      main: '#c6ab27',
      light: '#d8d835',
    },
  },
})

export {
  theme
}
