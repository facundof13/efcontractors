import React from 'react';
import { TextField, Button } from '@material-ui/core';
import Axios from 'axios';
import { AddInvoiceService } from './add-invoice-service';
export default class InvoiceSettings extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			company: '',
			address: '',
			cityState: '',
			zip: '',
			taxAmt: 0
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	componentDidMount() {
		Axios.get('/admin/api/invoicesettings').then((res) => {
			this.setState({
				company: res.data.company,
				address: res.data.address,
				cityState: res.data.cityState,
				zip: res.data.zip,
				taxAmt: res.data.taxAmt
			});
		});
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleSave() {
		Axios.post('/admin/api/invoicesettings', {
			settings: {
				company: this.state.company,
				address: this.state.address,
				cityState: this.state.cityState,
				zip: this.state.zip,
				taxAmt: this.state.taxAmt
			}
		}).then(window.location.reload());
	}

	render() {
		return (
			<div>
				<div>
					<div>
						<TextField
							value={this.state.company}
							name='company'
							label='Company'
							color='secondary'
							onChange={this.handleChange}
						/>
						<TextField
							value={this.state.address}
							name='address'
							label='Address'
							color='secondary'
							onChange={this.handleChange}
						/>
						<TextField
							value={this.state.cityState}
							name='cityState'
							label='City, State'
							color='secondary'
							onChange={this.handleChange}
						/>
						<TextField
							value={this.state.zip}
							name='zip'
							label='Zip'
							color='secondary'
							onChange={this.handleChange}
						/>
						<TextField
							value={this.state.taxAmt}
							name='taxAmt'
							label='Tax Amount'
							color='secondary'
							onChange={this.handleChange}
						/>
					</div>
					<div>
						<Button
							className='btn-login'
							variant='outlined'
							color='secondary'
							onClick={this.handleSave}>
							Save
						</Button>
					</div>
				</div>
				<AddInvoiceService />
			</div>
		);
	}
}
