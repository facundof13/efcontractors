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
      months: [],
      total: 0
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
      currentMonth: e.target.value,
      total: 0
    }, () => {
      // Get estimates from this month
      Axios.post('/admin/estimatesinmonth', {month: this.state.currentMonth}).then(res => {
        res.data.map(est => {
          console.log(est)
          if (est.paid) {
            this.setState(prevState =>({
              total: prevState.total += est.total
            }))
          }
        })
      })
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

        <div className='income-total'>
        <Typography component="span" variant="subtitle1">
          <p>{Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(this.state.total)}</p>
          </Typography>
        </div>
      </div>
    );
  }
}
