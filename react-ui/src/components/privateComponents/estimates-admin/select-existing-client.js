import React from 'react';
import { MenuItem, FormControl, InputLabel, Select } from '@material-ui/core';
export default class SelectExistingClient extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedCustomer: []
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState(
			{
				selectedCustomer: event.target.value
			},
			() => this.props.update(this.state.selectedCustomer)
		);
	}

	render() {
		let value = (
			<form id='item-form'>
				<div className='login'>
					<FormControl>
						<InputLabel htmlFor='customer-select'>Client</InputLabel>
						<Select
							className='estimate-item-select-width'
							id='item-select'
							onChange={this.handleChange}
							value={this.state.selectedCustomer}
							name='selectedCustomer'>
							<MenuItem value=''>None</MenuItem>
							{this.props.customers.map((customer) => (
								<MenuItem value={customer} key={customer._id}>
									{customer.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
			</form>
		);

		return this.props.customers ? value : '';
	}
}
