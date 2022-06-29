import React from 'react';
import { Tabs, Tab, AppBar } from '@material-ui/core';
import CompanyInformation from './CompanyInformation';
import ManageServices from './ManageServices';
import InvoiceSettings from './InvoiceSettings';

export default class Settings extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: 'one'
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e, value) {
		this.setState({ value: value });
	}
	render() {
		return (
			<div className='settings-root'>
				<AppBar position='static' className='tabs-bar'>
					<Tabs
						value={this.state.value}
						onChange={this.handleChange}
						centered={true}>
						<Tab value='one' label='Company Settings' />
						<Tab value='two' label='Invoice Settings' />
						<Tab value='three' label='Manage Services' />
					</Tabs>
				</AppBar>

				{this.state.value === 'one' ? <CompanyInformation /> : ''}
				{this.state.value === 'two' ? <InvoiceSettings /> : ''}
				{this.state.value === 'three' ? <ManageServices /> : ''}
			</div>
		);
	}
}
