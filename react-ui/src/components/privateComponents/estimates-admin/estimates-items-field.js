import React from 'react';
import {
	TextField,
	FormControlLabel,
	Checkbox,
	Select,
	MenuItem,
	IconButton,
	FormHelperText,
	FormControl,
	InputLabel,
	TableCell,
	TableRow,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

export default class ItemField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			serviceItem: '',
			itemDescription: '',
			quantity: '',
			num: 0,
			dollarAmount: '',
			itemError: '',
			descriptionError: '',
			quantityError: '',
			amountError: '',
			tax: false,
			expense: false,
			neither: false,
			editDescription: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleMoney = this.handleMoney.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
	}

	componentDidMount() {
		this.setState({
			num: this.props.num,
		});
	}

	handleOpen() {
		this.setState({ itemError: 'Required' });
	}

	handleChange(event) {
		var error = '';
		switch (event.target.name) {
			case 'itemDescription':
				error = 'descriptionError';
				break;
			case 'quantity':
				error = 'quantityError';
				break;
			default:
				break;
		}

		this.setState(
			{
				[event.target.name]: event.target.value,
				[error]: 'Required',
			},
			() => this.updateValues()
		);
	}

	handleCheckbox(event, isChecked) {
		this.setState({ [event.target.name]: isChecked }, () =>
			this.updateValues()
		);
	}

	handleMoney(event) {
		event.preventDefault();

		this.setState(
			{
				dollarAmount: '$' + event.target.value.replace(/\$/g, ''),
				amountError: 'Required',
			},
			() => this.updateValues()
		);
	}

	updateValues() {
		if (
			this.state.serviceItem !== '' &&
			this.state.quantity !== '' &&
			this.state.dollarAmount !== '' &&
			this.state.dollarAmount !== '$' &&
			this.state.itemDescription !== ''
		) {
			let itemsToReturn = {
				item: this.state.serviceItem,
				description: this.state.itemDescription,
				quantity: this.state.quantity,
				amount: this.state.dollarAmount,
				tax: this.state.tax,
				expense: this.state.expense,
				num: this.props.num,
			};
			this.props.updateItems(itemsToReturn);
		}
	}

	render() {
		return (
			// <form id="item-form">
			//   <div className="login">
			<tbody>
				<TableRow className='items-table'>
					<TableCell>
						<FormControl>
							<InputLabel htmlFor='customer-select'>Item</InputLabel>
							<Select
								className='estimate-item-select-width'
								id='item-select'
								onChange={this.handleChange}
								onOpen={this.handleOpen}
								value={this.state.serviceItem}
								name='serviceItem'
								required>
								{this.props.services
									? this.props.services.sort().map((item) => (
											<MenuItem value={item} key={item}>
												{item}
											</MenuItem>
									  ))
									: ''}
							</Select>
							<FormHelperText>
								{this.state.serviceItem === '' ? this.state.itemError : ''}
							</FormHelperText>
						</FormControl>
					</TableCell>

					<TableCell
						onClick={() => {
							this.setState({ editDescription: true });
						}}>
						{/* <div className="login"> */}
						<TextField
							name='itemDescription'
							type='text'
							color='secondary'
							placeholder='Description'
							multiline
							value={this.state.itemDescription}
							helperText={
								this.state.itemDescription === ''
									? this.state.descriptionError
									: ''
							}
						/>
					</TableCell>
					<TableCell>
						<TextField
							name='quantity'
							type='number'
							color='secondary'
							placeholder='Quantity'
							helperText={
								this.state.quantity === '' ? this.state.quantityError : ''
							}
							value={this.state.quantity}
							onChange={this.handleChange}
						/>
					</TableCell>
					<TableCell>
						<TextField
							name='dollarAmount'
							type='text'
							color='secondary'
							placeholder='$0.00'
							helperText={
								this.state.dollarAmount === '' ||
								this.state.dollarAmount === '$'
									? this.state.amountError
									: ''
							}
							value={this.state.dollarAmount}
							onChange={this.handleMoney}
						/>
					</TableCell>
					<TableCell>
						{/* checkboxes */}
						<FormControlLabel
							checked={this.state.tax}
							color='secondary'
							name='tax'
							control={<Checkbox color='secondary' />}
							onChange={this.handleCheckbox}
						/>
					</TableCell>
					<TableCell>
						<FormControlLabel
							checked={this.state.expense}
							color='secondary'
							name='expense'
							control={<Checkbox color='secondary' />}
							onChange={this.handleCheckbox}
						/>
					</TableCell>
					<TableCell>
						<IconButton
							color='secondary'
							onClick={() => this.props.removeItem(this.props.num)}
							title='Delete'>
							<DeleteOutlinedIcon />
						</IconButton>
					</TableCell>
				</TableRow>
				<Dialog
					className='descriptionDialog'
					open={this.state.editDescription}
					onClose={() => {
						this.setState({ editDescription: false });
					}}>
					<DialogTitle>Edit description</DialogTitle>
					<DialogContent>
						<div className='dialog-form'>
							<TextField
								autoFocus
								label='Description'
								name='itemDescription'
								onChange={(event) => this.handleChange(event)}
								value={this.state.itemDescription}
								multiline
								fullWidth
							/>
						</div>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => {
								this.setState({ editDescription: false });
							}}>
							Done
						</Button>
					</DialogActions>
				</Dialog>
			</tbody>

			//   </div>
			//   {/* </div> */}
			// </form>
		);
	}
}
