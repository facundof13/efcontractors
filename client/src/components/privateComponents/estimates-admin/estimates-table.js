import React from "react";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import Axios from "axios";

export default class EstimatesTable extends React.Component {
  constructor() {
    super();
    this.state = { customers: [] };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getCustomers = this.getCustomers.bind(this);
    this.deleteCustomer = this.deleteCustomer.bind(this);
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
    if (window.confirm(`Delete customer ${customer.name}?`)) {
      Axios.delete("/admin/invoiceCustomerId", { data: { id } }).then(res => {
        if (res.status === 200 || res.status === 304) {
          this.getCustomers();
        }
      });
    }
  }

  render() {
    return (
      <div>
        <Typography variant="h5" component="span" color="secondary">
          <h5>Estimates</h5>
        </Typography>

        <div id="table">
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Client Name</TableCell>
                  <TableCell align="right">Title</TableCell>
                  <TableCell align="right">Client Email</TableCell>
                  <TableCell align="right">Client Street Address</TableCell>
                  <TableCell align="right">Clienty City, State</TableCell>
                  <TableCell align="right">Client Zip Code</TableCell>
                  <TableCell align="right">Date Created</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.customers.map(row => (
                  <TableRow key={row.name}>
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
                      <IconButton onClick={() => this.deleteCustomer(row)}>
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}
