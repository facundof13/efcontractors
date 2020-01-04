import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';

export default class ProjectList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			project: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.render = this.render.bind(this);
	}

	handleChange(event, value) {
		this.setState({ project: event.target.value });
		this.props.getUser(value.key);
	}

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			if (Object.keys(this.props.user).length !== 0) {
				this.setState({ project: this.props.user.name });
			} else {
				this.setState({ project: '' });
			}
		}
	}

	render() {
		return (
			<div>
				<form id='item-form'>
					<div className='login'>
						<FormControl>
							<InputLabel htmlFor='customer-select'>
								Select a project
							</InputLabel>
							<Select
								className='estimate-item-select-width'
								id='item-select'
								onChange={this.handleChange}
								value={this.state.project}
								name='selectedCustomer'>
								<MenuItem value=''>None</MenuItem>
								{this.props.projects &&
									this.props.projects.map((project) => (
										<MenuItem
											value={project.name}
											id={project._id}
											key={project._id}>
											{project.name}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</div>
				</form>
			</div>
		);
	}
}
