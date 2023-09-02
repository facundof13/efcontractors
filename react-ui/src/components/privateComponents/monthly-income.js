import React from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import moment from "moment";
import Axios from "axios";
export default class MonthlyIncome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMonth: moment().format("MMMM YYYY"),
      months: [],
      total: 0,
      expensesTotal: 0,
      grandTotal: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getDates = this.getDates.bind(this);
    this.displayMonthIncome = this.displayMonthIncome.bind(this);
  }

  componentDidMount() {
    this.getDates();
    this.getGrandTotal();
    this.displayMonthIncome();
  }

  getGrandTotal() {
    let grandTotal = 0;
    Axios.post("/admin/api/estimatesinmonth").then((res) => {
      res.data.map((invoice) => {
        if (invoice.paid) {
          invoice.items.map((item) => {
            if (!item.expense) {
              grandTotal += Number(
                item.amount.replace(/[^0-9.-]+/g, "") * Number(item.quantity)
              );
            }
            return 0;
          });
        }
        return 0;
      });
      this.setState({
        grandTotal,
      });
    });
  }

  displayMonthIncome() {
    // Get estimates from this month
    Axios.post("/admin/api/estimatesinmonth", {
      month: this.state.currentMonth,
    }).then((res) => {
      // get paid total
      let paidTotal = 0;
      res.data.map((est) => {
        if (est.paid) {
          paidTotal += est.total;
        }
        return 0;
      });
      this.setState({
        total: paidTotal,
      });
      let expensesTotal = 0;
      res.data.map((estimate) => {
        estimate.items.map((item) => {
          if (item.expense) {
            expensesTotal +=
              Number(item.amount.replace(/[^0-9.-]+/g, "")) *
              Number(item.quantity);
          }
          return 0;
        });
        return 0;
      });
      this.setState({
        expensesTotal: expensesTotal,
      });
    });
  }

  handleChange(e) {
    this.setState(
      {
        currentMonth: e.target.value,
      },
      this.displayMonthIncome
    );
  }

  getDates() {
    Axios.get("/admin/api/months").then((res) => {
      this.setState({
        months: res.data,
      });
    });
  }

  render() {
    return (
      <div>
        <Typography component="span" variant="subtitle1" color="secondary">
          <p>
            Income to date:{" "}
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(this.state.grandTotal)}
          </p>
        </Typography>

        <div className="income-column">
          <Typography component="span" variant="subtitle1" color="secondary">
            <p>Income for month:</p>
          </Typography>
          <FormControl>
            <InputLabel htmlFor="income-month">Month</InputLabel>
            <Select
              value={this.state.currentMonth}
              onChange={this.handleChange}
            >
              {this.state.months.map((month) => {
                return month === "Invalid date" ? (
                  ""
                ) : (
                  <MenuItem
                    value={month}
                    selected={this.state.currentMonth}
                    key={month}
                  >
                    {month}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <div className="income-total">
          <Typography component="span" variant="subtitle1" color="secondary">
            <p>
              Paid:{" "}
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(this.state.total)}
            </p>
          </Typography>
          <Typography component="span" variant="subtitle1" color="secondary">
            <p>
              Expenses:{" "}
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(this.state.expensesTotal)}
            </p>
          </Typography>
          <Typography component="span" variant="subtitle1" color="secondary">
            <p>
              Net Income:{" "}
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(this.state.total - this.state.expensesTotal)}
            </p>
          </Typography>
        </div>
      </div>
    );
  }
}
