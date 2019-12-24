import React from 'react';
import MonthlyIncome from './monthly-income';

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
