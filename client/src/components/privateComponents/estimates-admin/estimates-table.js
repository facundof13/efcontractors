import React from "react";
import orderBy from "lodash/orderBy";
import _ from "lodash";
import prettifyDate from "../helperComponents/prettify-date";
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
  Grid,
  TextField
} from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import KeyboardArrowDownOutlined from "@material-ui/icons/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlined from "@material-ui/icons/KeyboardArrowUpOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import Axios from "axios";
import CustomerEstimateTable from "./customer-estimate-table";

const invertDirection = {
  asc: "desc",
  desc: "asc"
};
const headerRow = ["Title", "Expiration", "Total", "Date Created", "Invoice"];

export default class EstimatesTable extends React.Component {
  constructor() {
    super();
    this.state = {
      customers: [],
      columnToSort: "date",
      sortDirection: "desc",
      customerItems: [],
      currentlyEditing: false,
      customerToEdit: [],
      unChangedArray: [],
      customerInfo: []
    };

    this.dummyRef = React.createRef();

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getCustomers = this.getCustomers.bind(this);
    this.deleteCustomer = this.deleteCustomer.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.editCustomer = this.editCustomer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEstimateSave = this.handleEstimateSave.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getCustomers();
  }

  getCustomers(changeItems) {
    Axios.get("/admin/invoiceCustomers").then(res => {
      this.setState({ customers: res.data }, function() {
        if (changeItems) {
          let id = this.state.customerInfo._id;
          let idx = 0;
          for (let i = 0; i < this.state.items.length; i++) {
            if (this.state.items[i]._id === id) {
              idx = i;
            }
          }
          console.log(idx);
          this.setState({
            customerItems: this.state.items[idx].estimates
          });
        }
      });
    });
  }

  deleteCustomer(customer) {
    var id = customer._id;
    if (window.confirm(`Delete client ${customer.name}?`)) {
      Axios.delete("/admin/invoiceCustomerId", { data: { id } }).then(res => {
        if (res.status === 200 || res.status === 304) {
          this.setState({
            customerItems: []
          });
          this.getCustomers();
        }
      });
    }
  }

  handleSort(name) {
    // var column = event.target.outerText;
    this.setState(prevState => ({
      columnToSort: name,
      sortDirection:
        prevState.columnToSort === name
          ? invertDirection[prevState.sortDirection]
          : "asc"
    }));
  }

  handleClick(row, index) {
    if (this.state.customerItems === row.estimates) {
      this.setState({ customerItems: [] });
    } else {
      this.setState(
        {
          customerItems: row.estimates,
          customerInfo: row,
          index: index
        },
        () => {
          if (this.state.customerItems.length > 0) {
            window.scrollTo(0, window.innerHeight);
          }
        }
      );
    }
  }

  editCustomer(row) {
    this.setState(prevState => ({
      currentlyEditing: true,
      customerItems: [],
      customerToEdit: [JSON.parse(JSON.stringify(row))],
      unChangedArray: [JSON.parse(JSON.stringify(row))]
    }));
  }

  handleChange(event) {
    let changedArray = [...this.state.customerToEdit];
    changedArray[0][event.target.name] = event.target.value;
    this.setState(prevState => ({
      customerToEdit: changedArray
    }));
    console.log(event.target.name);
    // console.log(this.state.customerToEdit)
    // console.log(changedArray)
  }

  handleSave() {
    // console.log(this.state)
    // let updatedCustomer = this.state.customerToEdit[0];
    //check to make sure email, phone, cityState, zipcode, and date match
    let emailOk = false;
    let phoneOk = false;
    let cityStateOk = false;
    let zipOk = false;

    if (
      this.state.customerToEdit[0]["email"].match(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/
      )
    ) {
      emailOk = true;
    } else emailOk = false;
    if (
      this.state.customerToEdit[0]["phone"].match(
        /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s-]?[\0-9]{3}[\s-]?[0-9]{4}$/g
      )
    ) {
      phoneOk = true;
    } else phoneOk = false;
    if (
      this.state.customerToEdit[0]["cityState"].match(
        /([A-Za-z]+(?: [A-Za-z]+)*),? ([A-Za-z]{2})/
      )
    ) {
      cityStateOk = true;
    } else cityStateOk = false;
    if (this.state.customerToEdit[0]["zip"].match(/^\d{5}$/)) {
      zipOk = true;
    } else zipOk = false;

    if (emailOk && phoneOk && cityStateOk && zipOk) {
      Axios.post("/admin/updateCustomer", {
        customer: this.state.customerToEdit[0]
      }).then(res => {
        if (res.status === 200 || res.status === 304) {
          this.setState({ currentlyEditing: false, customerToEdit: [] });
          this.getCustomers();
        }
      });
    } else {
      let alertString = "The following fields are incorrect: ";
      if (!emailOk) alertString += "email ";
      if (!phoneOk) alertString += "phone ";
      if (!cityStateOk) alertString += "city/state ";
      if (!zipOk) alertString += "zip ";

      window.alert(alertString);
    }
  }

  handleEstimateSave = obj => {
    let id = this.state.customerInfo._id;
    Axios.post("/admin/updateestimate", { id: id, obj: obj }).then(() => {
      this.getCustomers(true);
      // () {
      // console.log(this.state);
      // let customersCopy = [...this.state.customers]
      // let idx = 0;
      // for (let i = 0; i < customersCopy.length; i++) {
      //   if (customersCopy[i]._id === id) {
      //     idx = i;
      //   }
      // }
      // console.log(idx);
      // this.setState({
      //   customerItems: customersCopy[idx].estimates
      // });
      // });
      // this.setState({customerItems: this.state.customers[idx].estimates}, () =)
    });
  };

  handleCancel() {
    this.setState({
      currentlyEditing: false,
      customerToEdit: [...this.state.unChangedArray]
    });
  }
  render() {
    // console.log(this.state);
    return (
      <div>
        <Typography variant="h5" component="span" color="secondary">
          <h5>Estimates</h5>
        </Typography>

        <Grid container justify="center">
          <Paper className="customer-table">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      align="left"
                      onClick={() => this.handleSort("name")}
                    >
                      Client Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort("email")}
                    >
                      Client Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort("phone")}
                    >
                      Client Phone Number
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort("address")}
                    >
                      Client Street Address
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort("cityState")}
                    >
                      Client City, State
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort("zip")}
                    >
                      Client Zip Code
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort("date")}
                    >
                      Date Created
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.currentlyEditing
                  ? this.state.customerToEdit.map(customer => (
                      <TableRow key={customer._id}>
                        <TableCell component="th" scope="row" align="left">
                          <TextField
                            name="name"
                            onChange={this.handleChange}
                            value={customer.name}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            name="email"
                            onChange={this.handleChange}
                            value={customer.email}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            name="phone"
                            onChange={this.handleChange}
                            value={customer.phone}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            name="address"
                            onChange={this.handleChange}
                            value={customer.address}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            name="cityState"
                            onChange={this.handleChange}
                            value={customer.cityState}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            name="zip"
                            onChange={this.handleChange}
                            value={customer.zip}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            disabled
                            name="date"
                            onChange={this.handleChange}
                            value={prettifyDate(customer.date)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            title="Save estimate"
                            onClick={this.handleSave}
                          >
                            <SaveOutlinedIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            title="Cancel"
                            onClick={this.handleCancel}
                          >
                            <CancelOutlinedIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  : orderBy(
                      this.state.customers,
                      this.state.columnToSort,
                      this.state.sortDirection
                    ).map((row, index) => (
                      <TableRow hover={true} key={row._id}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.email}</TableCell>
                        <TableCell align="right">{row.phone}</TableCell>
                        <TableCell align="right">{row.address}</TableCell>
                        <TableCell align="right">{row.cityState}</TableCell>
                        <TableCell align="right">{row.zip}</TableCell>
                        <TableCell align="right">
                          {prettifyDate(row.date)}
                        </TableCell>
                        <TableCell align="right">
                          <div>
                            {this.state.customerItems === row.estimates ? (
                              <IconButton
                                size="small"
                                title="Hide estimates"
                                onClick={() => this.handleClick(row, index)}
                              >
                                <KeyboardArrowUpOutlined />
                              </IconButton>
                            ) : (
                              <IconButton
                                size="small"
                                title="Show estimates"
                                onClick={() => this.handleClick(row, index)}
                              >
                                <KeyboardArrowDownOutlined />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              title="Edit client info"
                              onClick={() => this.editCustomer(row)}
                            >
                              <CreateOutlinedIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              title="Delete client"
                              onClick={() => this.deleteCustomer(row)}
                            >
                              <DeleteOutlinedIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid container justify="center">
          <div>
            {this.state.customerItems.length > 0 ? (
              <CustomerEstimateTable
                key="1"
                items={this.state.customerItems}
                headerRow={headerRow}
                customerInfo={this.state.customerInfo}
                handleSave={this.handleEstimateSave}
              />
            ) : (
              ""
            )}
          </div>
        </Grid>
      </div>
    );
  }
}
