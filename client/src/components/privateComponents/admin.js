import React from "react";
import Typography from "@material-ui/core/Typography";
import MonthlyIncome from './monthly-income'

export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div>
      <Typography component="span" variant="h4">
        <h4 className="yellow">Admin Home</h4>
      </Typography>
      <MonthlyIncome />
      </div>
    );
  }
}
