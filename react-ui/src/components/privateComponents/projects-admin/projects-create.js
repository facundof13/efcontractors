import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import Axios from 'axios';

class ProjectsCreate extends Component {
	constructor() {
		super();
		this.state = {
			correctInputs: false,
			name: '',
			location: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		Axios.post('/admin/api/newproject', {
			name: this.state.name,
			location: this.state.location
		}).then((res) => {
			if (res.data.error) {
				window.alert(res.data.error);
			} else if (res.status === 200) {
				this.setState({ name: '', location: '' });
				document.getElementById('project-form').reset();
				this.props.handleSubmit();
			}
		});
	}

	render() {
		return (
			<div className='create-container'>
				<form autoComplete='off' id='project-form' onSubmit={this.handleSubmit}>
					<div className='login'>
						<TextField
							label='First Last'
							name='name'
							type='text'
							color='secondary'
							onChange={this.handleChange}
						/>
						<TextField
							label='City, State'
							name='location'
							type='text'
							color='secondary'
							onChange={this.handleChange}
						/>
					</div>
					<Button
						color='secondary'
						variant='text'
						type='submit'
						className='create-project-btn'>
						Create new project
					</Button>
				</form>
			</div>
		);
	}
}

export default ProjectsCreate;
