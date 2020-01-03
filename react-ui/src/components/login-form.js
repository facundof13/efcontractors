import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';

var myTimeout;
class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			redirectTo: null,
			error: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillUnmount() {
		clearTimeout(myTimeout);
		this.setState({
			username: '',
			password: '',
			redirectTo: null,
			error: false
		});
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();

		axios
			.post('/api/login', {
				username: this.state.username,
				password: this.state.password
			})
			.then((response) => {
				if (response.status === 200) {
					// update App.js state
					this.props.updateUser({
						loggedIn: true,
						username: response.data.username
					});
					// update the state to redirect to home
					this.setState({
						redirectTo: '/admin'
					});
				}
			})
			.catch((error) => {
				this.setState({ error: true }, () => {
					myTimeout = setTimeout(() => {
						this.setState({ error: false });
					}, 3000);
				});
			});
	}

	render() {
		if (this.state.redirectTo) {
			return <Redirect to={{ pathname: this.state.redirectTo }} />;
		} else {
			return (
				<div>
					{this.state.error && (
						<div className='error'>
							<p>Wrong username or password</p>
						</div>
					)}
					<form>
						<div>
							<Typography color='secondary'>
								<label htmlFor='username'>Username</label>
							</Typography>
							<div className='login'>
								<TextField
									autoCorrect='off'
									autoCapitalize='none'
									autoComplete='username'
									type='text'
									id='username'
									name='username'
									color='secondary'
									placeholder='username'
									variant='outlined'
									value={this.state.username}
									onChange={this.handleChange}
								/>
								<Typography color='secondary'>
									<label htmlFor='password'>Password </label>
								</Typography>

								<TextField
									autoCorrect='off'
									autoCapitalize='none'
									autoComplete='current-password'
									name='password'
									type='password'
									placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
									color='secondary'
									variant='outlined'
									value={this.state.password}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div className='btn-login'>
							<Button
								variant='contained'
								color='secondary'
								onClick={this.handleSubmit}
								type='submit'
								className='btn-login'>
								Login
							</Button>
						</div>
					</form>
				</div>
			);
		}
	}
}

export default LoginForm;
