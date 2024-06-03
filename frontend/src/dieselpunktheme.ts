import { extendTheme } from "@mui/joy";

export const dieselpunkTheme = extendTheme({
  "colorSchemes": {
    "light": {
      "palette": {
        "primary": {
          "solidBg": "#be612e",
          "solidDisabledColor": "#000000",
          "solidDisabledBg": "#ADBBA7",
          "solidColor": "#FFF7C2",
          "solidHoverBg": "#CE5B5B"

        }
      }
    },
  },
  components: {
    JoyCard: {
      styleOverrides: {
        root: () => ({
          backgroundColor: '#5C6950',
          color: '#FFF7C2',
          borderColor: '#FFF7E2',
        }),
      },
    },
    JoyLink: {
      styleOverrides: {
        root: () => ({
          color: '#be612e',
          textDecorationColor: 'red',
          '&:hover': {
            color: 'red',
          },
          fontWeight: 'bold',
        }),
      },
    },
    JoyTabs: {
      styleOverrides: {
        root: () => ({
          backgroundColor: '#0d1105',
          color: '#FFF7C2',
          borderColor: '#FFF7E2',
        }),
      },
    },
    JoyTab: {
      styleOverrides: {
        root: () => ({
          backgroundColor: '#0d1105',
          color: '#FFF7C2',
          '&.Mui-selected': {
            borderColorBottom: '#FFF7E2',
            color: '#FFF7C2',
            backgroundColor: '#0d1105',
          },
          '&:hover': {
            backgroundColor: '#FFF7C2',
            color: '#0d1105',
          },
          selected: {
            backgroundColor: 'red',
            color: '#0d1105',
          },
        }),
      },
    },
  },
  typography: {
    h1: {
      color: '#FFF9C5',
    },
    h2: {
      color: '#FFF9C5',
    },
    h3: {
      color: '#FFF9C5',
    },
    h4: {
      color: '#FFF9C5',
    },
    'body-md': {
      color: '#FFF9C5',
    },
  },
  "fontFamily": {
    "display": "Inter",
    "body": "Inter"
  }
});


