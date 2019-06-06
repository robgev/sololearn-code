import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
	palette: {
		primary: {
			main: '#1ED1AE',
			dark: '#05B895',
			light: '#38EBC8',
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#8BC34A',
			contrastText: '#FFFFFF',
		},
	},
	typography: {
		fontFamily: '\'Muli\', sans-serif',
	},
});
