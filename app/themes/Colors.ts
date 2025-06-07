type ColorType =
  | 'black'
  | 'white'
  | 'grey'
  | 'lightGrey'
  | 'red'
  | 'primary'
  | 'overlay';

export const StaticColors: Record<ColorType, string> = {
  black: '#000000',
  white: '#ffffff',
  grey: '#515254',
  lightGrey: '#555555',
  red: '#FE4130',
  primary: '#0068E0',
  overlay: 'rgba(0,0,0,0.3)',
};
