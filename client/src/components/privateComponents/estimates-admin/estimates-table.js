import React from "react";
import orderBy from 'lodash/orderBy'
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TableSortLabel,
  Grid
} from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import Axios from "axios";

const invertDirection = {
  asc: "desc",
  desc: "asc"
};

export default class EstimatesTable extends React.Component {
  constructor() {
    super();
    this.state = {
      customers: [],
      columnToSort: "Date Created",
      sortDirection: "desc"
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getCustomers = this.getCustomers.bind(this);
    this.deleteCustomer = this.deleteCustomer.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.getCustomers();
  }

  getCustomers() {
    Axios.get("/admin/invoiceCustomers").then(res => {
      this.setState({ customers: res.data });
    });
  }

  deleteCustomer(customer) {
    var id = customer._id;
    if (window.confirm(`Delete client ${customer.name}?`)) {
      Axios.delete("/admin/invoiceCustomerId", { data: { id } }).then(res => {
        if (res.status === 200 || res.status === 304) {
          this.getCustomers();
        }
      });
    }
  }

  handleSort(name) {
    // var column = event.target.outerText;
    this.setState(
      prevState => ({
        columnToSort: name,
        sortDirection:
          prevState.columnToSort === name
            ? invertDirection[prevState.sortDirection]
            : "asc",
      })
    );

    // console.log("sort");
    // this.setState(
    //   prevState => ({
    //     customers: prevState.customers.sort((a, b) => a.date - b.date)
    //   }),
    //   () => console.log(this.state.customers)
    // );
  }

  render() {
    return (
      <div>
        <Typography variant="h5" component="span" color="secondary">
          <h5>Estimates</h5>
        </Typography>

        <Grid container justify='center'>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      align="left"
                      onClick={() => this.handleSort('name')}
                    >
                      Client Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort('title')}
                    >
                      Title
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort('email')}
                    >
                      Client Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort('address')}
                    >
                      Client Street Address
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort('cityState')}
                    >
                      Client City, State
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort('zip')}
                    >
                      Client Zip Code
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort('date')}
                    >
                      Date Created
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {(orderBy(this.state.customers, this.state.columnToSort, this.state.sortDirection)).map(row => (
                  <TableRow key={row._id}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.title}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.address}</TableCell>
                    <TableCell align="right">{row.cityState}</TableCell>
                    <TableCell align="right">{row.zip}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => this.deleteCustomer(row)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </div>
    );
  }
}
