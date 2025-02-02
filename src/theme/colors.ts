export const colors = {
  // Couleurs primaires
  primary: {
    main: '#60A5FA',
    light: '#93C5FD',
    dark: '#2563EB',
  },
  // Couleurs secondaires
  secondary: {
    main: '#A78BFA',
    light: '#C4B5FD',
    dark: '#7C3AED',
  },
  // Arrière-plans
  background: {
    default: '#0D0F1E',
    paper: 'rgba(17, 24, 39, 0.8)',
    card: 'rgba(17, 24, 39, 0.95)',
    overlay: 'rgba(17, 24, 39, 0.9)',
  },
  // Texte
  text: {
    primary: '#F3F4F6',
    secondary: '#D1D5DB',
    disabled: '#6B7280',
  },
  // Dégradés
  gradients: {
    primary: 'linear-gradient(45deg, #60A5FA, #A78BFA)',
    dark: 'linear-gradient(180deg, rgba(13, 15, 30, 1) 0%, rgba(27, 32, 63, 1) 50%, rgba(41, 49, 95, 1) 100%)',
    glass: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
  },
  // États
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#60A5FA',
  },
  // Bordures
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    focus: 'rgba(96, 165, 250, 0.5)',
  },
} as const;

export const shadows = {
  card: '0 4px 30px rgba(0, 0, 0, 0.1)',
  hover: '0 8px 40px rgba(0, 0, 0, 0.2)',
  button: '0 4px 20px rgba(96, 165, 250, 0.4)',
} as const;
