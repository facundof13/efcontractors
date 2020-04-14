import React from 'react';
import {
	TableHead,
	Paper,
	Table,
	TableRow,
	TableCell,
	TableBody,
	TextField,
	FormControlLabel,
	Checkbox,
	FormControl,
	IconButton,
	Select,
	MenuItem,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@material-ui/core';
import Axios from 'axios';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import AddCircleOutlined from '@material-ui/icons/AddCircleOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { subtractDates, addDates } from '../helperComponents/prettify-date';
import PaymentSchedule from './payment-schedule';

export default class EditCreatedEstimatesTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectItem: null,
			services: [],
			date: this.props.estimateToEdit.date,
			attachContract: this.props.estimateToEdit.attachContract,
			contractSpecs: this.props.estimateToEdit.contractSpecs,
			expiration: subtractDates(
				this.props.estimateToEdit.date,
				this.props.estimateToEdit.expiration
			),
			invoice: this.props.estimateToEdit.invoice,
			title: this.props.estimateToEdit.title,
			items: [...this.props.estimateToEdit.items],
			paid: this.props.estimateToEdit.paid,
			open: false,
			steps: [],
			paymentSteps: [...this.props.estimateToEdit.paymentSteps],
			pdfLink: this.props.estimateToEdit.pdfLink,
			copyPayments: [],
			copySteps: [],
			estimateNum: this.props.estimateToEdit.estimateNum,
			paidDate: this.props.estimateToEdit.paidDate,
			softTotal: 0,
			editItem: false,
			tempDescription: '',
			descriptionIndex: 0,
		};

		let total = 0;
		for (const item of this.state.items) {
			total += Number(item.amount.replace('$', ''));
		}
		this.state.softTotal = total;

		this.handleChange = this.handleChange.bind(this);
		this.render = this.render.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.getServices = this.getServices.bind(this);
		this.getSelector = this.getSelector.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.cancelEdit = this.cancelEdit.bind(this);
		this.addItemField = this.addItemField.bind(this);
		this.deleteRow = this.deleteRow.bind(this);
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.addStep = this.addStep.bind(this);
		this.removeStep = this.removeStep.bind(this);
		this.updateStep = this.updateStep.bind(this);
		this.handleContractSave = this.handleContractSave.bind(this);
		this.editDescription = this.editDescription.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleDescriptionSave = this.handleDescriptionSave.bind(this);
	}

	componentDidMount() {
		this.getServices();
		let newStepsArr = [];
		this.state.paymentSteps.map((item, i) => {
			var step = (
				<PaymentSchedule
					key={item.id}
					id={item.id}
					removeStep={() => this.removeStep(item.id)}
					updateStep={this.updateStep}
					existingStep={item}
				/>
			);
			newStepsArr.push(step);
			return true;
		});
		if (this.state.paymentSteps.length > 0) {
			this.setState({ steps: newStepsArr });
		}
	}

	getSelector(item, index) {
		return (
			<FormControl className='item-select'>
				<Select
					className='edit-estimate-item-selector'
					onChange={(event) => this.handleChange(event, index)}
					value={item}
					displayEmpty={true}
					name='item'>
					<MenuItem value={item}>{item}</MenuItem>
					{this.state.services.map((service) =>
						service === item ? (
							''
						) : (
							<MenuItem
								value={service}
								selected={service === item}
								key={service}>
								{service}
							</MenuItem>
						)
					)}
				</Select>
			</FormControl>
		);
	}

	getServices() {
		return new Promise((resolve, reject) => {
			Axios.get('/admin/api/invoiceServices').then((res) => {
				this.setState({ services: res.data });
				resolve();
			});
		});
	}

	handleChange(event, index) {
		let stateToChange = [...this.state.items];
		if (event === 'description') {
			stateToChange[index]['description'] = this.state.tempDescription;
			this.setState({
				items: stateToChange,
			});
		} else {
			let key = event.target.name;
			let value = event.target.value;
			if (
				event.target.name === 'title' ||
				event.target.name === 'expiration' ||
				event.target.name === 'contractSpecs'
			) {
				this.setState({ [key]: value });
			} else if (
				event.target.name === 'attachContract' ||
				event.target.name === 'invoice'
			) {
				// if (event.target.name === 'invoice' && !event.target.value) {
				// 	this.setState({ attachContract: false })
				// }
				this.setState({ [key]: event.target.checked });
			} else if (
				event.target.name === 'tax' ||
				event.target.name === 'expense'
			) {
				stateToChange[index][key] = event.target.checked;
				this.setState({
					items: stateToChange,
				});
			} else {
				stateToChange[index][key] = value;
				this.setState(
					{
						items: stateToChange,
					},
					() => {
						let total = 0;
						for (const item of this.state.items) {
							total += Number(item.amount.replace('$', ''));
						}
						this.setState({ softTotal: total });
					}
				);
			}
		}
	}

	cancelEdit() {
		this.props.cancelEdit();
	}

	handleSave() {
		let itemsNotEmpty = true;

		let total = 0;
		this.state.items.forEach((item) => {
			total += Number(item.amount.replace('$', ''));
			item.amount === '$' ||
			item.item === '' ||
			item.quantity === '' ||
			item.description === ''
				? (itemsNotEmpty = false)
				: (itemsNotEmpty = true);
		});

		let object = {
			items: [...this.state.items],
			invoice: this.state.invoice,
			attachContract: this.state.attachContract,
			total: total,
			expiration: addDates(this.state.date, this.state.expiration),
			title: this.state.title,
			date: this.state.date,
			contractSpecs: this.state.contractSpecs,
			paymentSteps: this.state.paymentSteps,
			paid: this.state.paid,
			pdfLink: this.state.pdfLink,
			estimateNum: this.state.estimateNum,
			paidDate: this.state.paidDate,
		};
		if (itemsNotEmpty) {
			this.props.handleSave(object);
		} else {
			window.alert('Empty item');
		}
	}

	addItemField() {
		this.setState((prevState) => ({
			items: [
				...this.state.items,
				{
					num: Date.now(), //add default values to new item
					amount: '$',
					description: '',
					expense: false,
					item: '',
					quantity: '',
					tax: false,
				},
			],
		}));
		setTimeout(() => {}, 200);
	}

	deleteRow(row) {
		let filter = this.state.items.filter(function (item) {
			return item.num !== row.num;
		});
		this.setState({ items: filter });
	}

	handleClickOpen() {
		if (this.state.steps.length === this.state.paymentSteps.length) {
			var filter = this.state.steps.filter((item) => {
				return !item.props.existingStep;
			});
			var newSteps = [];
			if (filter.length > 0) {
				this.state.paymentSteps.map((payment) => {
					newSteps.push(
						<PaymentSchedule
							key={payment.id}
							id={payment.id}
							removeStep={() => this.removeStep(payment.id)}
							updateStep={this.updateStep}
							existingStep={payment}
						/>
					);
					return true;
				});
				this.setState({
					steps: [...newSteps],
				});
			}
			this.setState({
				open: true,
				copyPayments: [...this.state.paymentSteps],
				copySteps: [...this.state.steps],
			});
		}
	}

	handleCancel() {
		this.setState({
			open: false,
			paymentSteps: [...this.state.copyPayments],
			steps: [...this.state.copySteps],
		});
	}

	addStep() {
		var id = Date.now();
		var step = (
			<PaymentSchedule
				key={id}
				id={id}
				removeStep={() => this.removeStep(id)}
				updateStep={this.updateStep}
			/>
		);
		this.setState({ steps: [...this.state.steps, step] });
	}

	removeStep(id) {
		let stepsArr = this.state.steps.filter(function (item) {
			return item.props.id !== id;
		});
		let paymentStepsArr = this.state.paymentSteps.filter(function (item) {
			return item.id !== id;
		});

		this.setState({
			paymentSteps: [...paymentStepsArr],
			steps: [...stepsArr],
		});
	}

	updateStep(obj) {
		var filter = [];
		if (this.state.paymentSteps.length > 0) {
			filter = this.state.paymentSteps.filter((item) => {
				return item.id !== obj.id;
			});
		}
		this.setState({ paymentSteps: [...filter, obj] });
	}

	handleContractSave() {
		// make sure each payment step is valid
		this.state.paymentSteps.forEach((item) => {
			if (
				item.stepName === '' ||
				item.stepAmount === '' ||
				item.stepDescription === ''
			) {
				window.alert('Incorrect step');
			} else {
				this.setState({ open: false });
			}
		});
		if (this.state.paymentSteps.length === 0) {
			this.setState({ open: false });
		}
	}

	editDescription(text, index) {
		this.setState({
			editItem: true,
			tempDescription: text,
			descriptionIndex: index,
		});
	}

	handleDescriptionChange(event) {
		this.setState({ tempDescription: event.target.value });
	}

	handleDescriptionSave() {
		this.handleChange('description', this.state.descriptionIndex);
		this.setState({
			editItem: false,
			tempDescription: '',
			descriptionIndex: 0,
		});
	}

	render() {
		return (
			<Paper className='estimates-table'>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Expiration</TableCell>
							<TableCell>Invoice</TableCell>
							<TableCell>Contract</TableCell>
							<TableCell>Total</TableCell>
							<TableCell />
							<TableCell />
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>
								<TextField
									name='title'
									onChange={(event) => this.handleChange(event)}
									value={this.state.title}
								/>
							</TableCell>
							<TableCell>
								<TextField
									name='expiration'
									onChange={(event) => this.handleChange(event)}
									value={this.state.expiration}
								/>
							</TableCell>
							<TableCell>
								<FormControlLabel
									name='invoice'
									className='estimate-checkbox'
									control={<Checkbox />}
									checked={this.state.invoice}
									onChange={(event) => this.handleChange(event)}
								/>
							</TableCell>
							<TableCell>
								<FormControlLabel
									name='attachContract'
									className='estimate-checkbox'
									control={<Checkbox />}
									checked={this.state.attachContract}
									onChange={(event) => this.handleChange(event)}
								/>
							</TableCell>
							<TableCell>${this.state.softTotal}</TableCell>
							<TableCell>
								<Button
									onClick={this.handleClickOpen}
									disabled={!this.state.attachContract}>
									Edit contract
								</Button>
								<div>
									<Dialog open={this.state.open} onClose={this.handleCancel}>
										<DialogTitle>Edit contract</DialogTitle>
										<DialogContent>
											<div className='dialog-form'>
												<TextField
													label='Contract Specifications'
													name='contractSpecs'
													onChange={(event) => this.handleChange(event)}
													value={this.state.contractSpecs}
													// multiline={true}
													fullWidth={true}
												/>
												<Button onClick={this.addStep}>Add Step</Button>
												{this.state.steps}
											</div>
										</DialogContent>
										<DialogActions>
											<Button onClick={this.handleCancel}>Cancel</Button>
											<Button onClick={this.handleContractSave.bind(this)}>
												Save
											</Button>
										</DialogActions>
									</Dialog>
								</div>
							</TableCell>
							<TableCell>
								<IconButton
									size='small'
									title='Add Item'
									onClick={this.addItemField}>
									<AddCircleOutlined />
								</IconButton>
							</TableCell>
							<TableCell align='right'>
								<IconButton
									size='small'
									title='Save estimate'
									onClick={this.handleSave}>
									<SaveOutlinedIcon />
								</IconButton>
								<IconButton
									size='small'
									title='Cancel edit'
									onClick={this.cancelEdit}>
									<CancelOutlinedIcon />
								</IconButton>
							</TableCell>
							<TableCell />
							<TableCell />
						</TableRow>
					</TableBody>
					<TableHead>
						<TableRow>
							<TableCell>Item</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Quantity</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell>Tax</TableCell>
							<TableCell>Expense</TableCell>
							<TableCell />
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						<Dialog
							className='descriptionDialog'
							open={this.state.editItem}
							onClose={() => {
								this.setState({ editItem: false });
							}}>
							<DialogTitle>Edit description</DialogTitle>
							<DialogContent>
								<div className='dialog-form'>
									<TextField
										label='Description'
										name='tempDescription'
										onChange={(event) => this.handleDescriptionChange(event)}
										value={this.state.tempDescription}
										multiline
										fullWidth
									/>
								</div>
							</DialogContent>
							<DialogActions>
								<Button
									onClick={() => {
										this.setState({ editItem: false });
									}}>
									Cancel
								</Button>
								<Button onClick={this.handleDescriptionSave}>Save</Button>
							</DialogActions>
						</Dialog>
						{this.state.items.map(function (item, index) {
							return (
								<TableRow key={item.num}>
									<TableCell>{this.getSelector(item.item, index)}</TableCell>
									<TableCell
										onClick={() => {
											this.editDescription(item.description, index);
										}}>
										<TextField
											name='description'
											// onChange={(event) => this.handleChange(event, index)}
											value={item.description}
										/>
									</TableCell>
									<TableCell>
										<TextField
											name='quantity'
											onChange={(event) => this.handleChange(event, index)}
											value={item.quantity}
										/>
									</TableCell>
									<TableCell>
										<TextField
											name='amount'
											onChange={(event) => this.handleChange(event, index)}
											value={`$${item.amount.replace('$', '')}`}
										/>
									</TableCell>
									<TableCell>
										<FormControlLabel
											checked={item.tax}
											name='tax'
											className='estimate-checkbox'
											control={<Checkbox />}
											onChange={(event) => this.handleChange(event, index)}
										/>
									</TableCell>
									<TableCell>
										<FormControlLabel
											checked={item.expense}
											name='expense'
											className='estimate-checkbox'
											control={<Checkbox />}
											onChange={(event) => this.handleChange(event, index)}
										/>
									</TableCell>
									<TableCell>
										<IconButton
											size='small'
											title='Cancel edit'
											onClick={() => this.deleteRow(item)}>
											<DeleteOutlinedIcon />
										</IconButton>
									</TableCell>
									<TableCell />
								</TableRow>
							);
						}, this)}
					</TableBody>
				</Table>
			</Paper>
		);
	}
}
