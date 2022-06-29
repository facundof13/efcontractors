import { FormControl, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';

export default class SelectExistingClient extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedCustomer: null
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event, value) {
		event.preventDefault();
		console.log(value)
		this.setState(
			{
				selectedCustomer: value
			},
			() => this.props.update(this.state.selectedCustomer)
		);
	}

	render() {
		let value = (
			<form id='item-form' onSubmit={e => { e.preventDefault(); }}>
				<div className='login'>
					<FormControl>
						<Autocomplete
							id="item-select"
							options={this.props.customers}
							onChange={this.handleChange}
							getOptionLabel={(customer) => customer.name}
							getOptionSelected={(customer, value) => customer._id === value._id}
							style={{ width: 300 }}
							renderInput={(params) => <TextField {...params} label="Client" variant="standard" />}
						/>
					</FormControl>
				</div>
			</form>
		);

		return this.props.customers ? value : '';
	}
}
