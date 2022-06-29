import React from 'react';
import MonthlyIncome from './MonthlyIncome';

export default class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {}

	render() {
		return (
			<div>
				<MonthlyIncome />
			</div>
		);
	}
}
