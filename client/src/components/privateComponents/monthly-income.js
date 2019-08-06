import React from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import moment from "moment";
import Axios from "axios";
export default class MonthlyIncome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMonth: moment().format("MMMM YYYY"),
      months: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getDates = this.getDates.bind(this);
  }

  componentDidMount() {
    this.getDates();
  }

  handleChange(e) {
    // console.log(e.target.value);
    this.setState({
      currentMonth: e.target.value
    });
  }

  getDates() {
    Axios.get('/admin/months')
    .then(res => {
        this.setState({
            months: res.data
        })
    })
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Typography component="span" variant="subtitle1">
          <p className="yellow">Income for month:</p>
        </Typography>

        <div className="income-column">
          <FormControl>
            <InputLabel htmlFor="income-month">Month</InputLabel>
            <Select
              value={this.state.currentMonth}
              onChange={this.handleChange}
            >
              {this.state.months.map(month => (
                <MenuItem
                  value={month}
                  selected={this.state.currentMonth}
                  key={month}
                >
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    );
  }
}
