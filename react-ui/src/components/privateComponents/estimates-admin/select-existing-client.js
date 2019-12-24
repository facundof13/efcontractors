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
		return (
			<form id='item-form'>
				<div className='login'>
					<FormControl>
						<InputLabel htmlFor='customer-select'>Client</InputLabel>
						<Select
							className='estimate-item-select-width'
							id='item-select'
							// className="estimate-item-select-width"
							// id="customer-select"
							onChange={this.handleChange}
							// onOpen={this.handleOpen}
							value={this.state.selectedCustomer}
							name='selectedCustomer'
							// required
						>
							<MenuItem value=''>None</MenuItem>
							{this.props.customers
								? this.props.customers.map((customer) => (
										<MenuItem value={customer} key={customer._id}>
											{customer.name}
										</MenuItem>
								  ))
								: ''}
						</Select>
						{/* <FormHelperText>
              {this.state.serviceItem === "" ? this.state.itemError : ""}
            </FormHelperText> */}
					</FormControl>
				</div>
			</form>
		);
	}
}
