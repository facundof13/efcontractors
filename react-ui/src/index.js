import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import HttpsRedirect from 'react-https-redirect';
import { BrowserRouter } from 'react-router-dom'; //don't need to specify localhost url in axios http address
import {
	MuiThemeProvider,
	createMuiTheme,
	responsiveFontSizes
} from '@material-ui/core/styles';

//style
import './index.css';

let theme = createMuiTheme({
	palette: {
		primary: {
			main: '#212121',
			secondary: '#616161'
		},
		secondary: {
			main: '#ffff00',
			secondary: '#9e9e9e'
		}
	}
});
theme = responsiveFontSizes(theme);

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<BrowserRouter>
			<HttpsRedirect>
				<App />
			</HttpsRedirect>
		</BrowserRouter>
	</MuiThemeProvider>,
	document.getElementById('root')
);
