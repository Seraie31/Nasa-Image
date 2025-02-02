import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradients: {
      primary: string;
      secondary: string;
    };
    border: {
      light: string;
      main: string;
      dark: string;
    };
    status: {
      error: string;
      warning: string;
      success: string;
      info: string;
    };
  }

  interface PaletteOptions {
    gradients?: {
      primary?: string;
      secondary?: string;
    };
    border?: {
      light?: string;
      main?: string;
      dark?: string;
    };
    status?: {
      error?: string;
      warning?: string;
      success?: string;
      info?: string;
    };
  }
}
