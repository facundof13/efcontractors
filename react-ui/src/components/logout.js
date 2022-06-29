import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';

export default function Logout({ updateUser }) {
	useEffect(() => {
		updateUser({ loggedIn: false, user: null });

		Axios.get(`${process.env.REACT_APP_ENDPOINT}/api/logout`);
	}, []);
	// 	constructor() {
	// 		super();
	// 		this.state = {
	// 			loggedOut: false
	// 		};
	// 		this.componentDidMount = this.componentDidMount.bind(this);
	// 	}

	// 	componentDidMount() {
	// 		Axios.get(`${process.env.REACT_APP_ENDPOINT}/api/logout`).then(() => {
	// 			this.setState({ loggedOut: true });
	// 			this.props.updateUser({
	// 				loggedIn: false,
	// 				username: ''
	// 			});
	// 		});
	// 	}

	// 	render() {
	// 		if (this.state.loggedOut) {
	// 			return <Redirect to='/' />;
	// 		}
	// 		return <h3>Logging out now, going home...</h3>;
	// 	}

	return <Redirect to="/" />
}
