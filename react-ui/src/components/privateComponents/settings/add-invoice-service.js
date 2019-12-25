import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import Axios from 'axios';
export const AddInvoiceService = () => {
	const [service, setService] = useState('');

	async function submitService(e) {
		e.preventDefault();
		let res = await Axios.post('/admin/api/addinvoiceservice', {
			service: service
		});
		if (res.status === 200) {
			window.alert(`Service ${service} added.`);
			setService('');
		}
	}

	return (
		<div>
			<Typography color='secondary' component='span' variant='h5'>
				<h5>Add a service for invoices</h5>
			</Typography>

			<div>
				<form onSubmit={submitService}>
					<div className='loading'>
						<TextField
							color='secondary'
							value={service}
							onChange={(e) => {
								setService(e.target.value);
							}}></TextField>
					</div>
					<Button variant='outlined' color='secondary' onClick={submitService}>
						Add service
					</Button>
				</form>
			</div>
		</div>
	);
};
