import React from 'react';
import '../App.css';
import Typography from '@material-ui/core/Typography';
import Axios from 'axios';

export default class Footer extends React.Component {
	constructor() {
		super();
		this.state = {
			date: '',
			telephone: '',
			email: '',
			company: '',
			cityStateZip: '',
			address: ''
		};
	}

	componentDidMount() {
		var date = new Date();
		this.setState({ date: date.getFullYear() });
		Axios.get('/admin/api/settings').then((res) => {
			this.setState({
				telephone: res.data.telephone,
				email: res.data.email,
				company: res.data.company,
				cityStateZip: res.data.cityStateZip,
				address: res.data.address
			});
		});
	}

	render() {
		return (
			<footer className='footer-bar'>
				<Typography variant='inherit' color='secondary'>
					<div className='footer-items'>
						<p>
							{this.state.address} {this.state.cityStateZip}{' '}
						</p>
						<p className='copyright-spacer'>
							{' '}
							Copyright © 2015-{this.state.date} {this.state.company}{' '}
						</p>
						<p>
							<a className='navbar-link' href='tel:4044093715'>
								{this.state.telephone}
							</a>
						</p>
					</div>
				</Typography>
			</footer>
		);
	}
}
