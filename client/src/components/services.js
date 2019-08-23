import React from "react";
import orderBy from "lodash/orderBy";
import {
  Typography,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableBody,
  TableSortLabel
} from "@material-ui/core";
import CheckOutlined from "@material-ui/icons/CheckOutlined";
import Axios from "axios";

const invertDirection = {
  asc: "desc",
  desc: "asc"
};

export default class Services extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      services: [],
      columnToSort: "Service",
      sortDirection: "asc"
    };

    this.getServices = this.getServices.bind(this);
  }

  componentDidMount() {
    this.getServices();
  }

  getServices() {
    Axios.get("/services").then(res => {
      this.setState({ services: res.data });
    });
  }

  handleSort(name) {
    this.setState(prevState => ({
      columnToSort: name,
      sortDirection:
        prevState.columnToSort === name
          ? invertDirection[prevState.sortDirection]
          : "asc"
    }));
  }

  render() {
    return (
      <div>
        <Typography color="secondary" component="span" variant="h4">
          <h4>Services</h4>
        </Typography>
        <div>
          <p className='services-text'>All the services you need, and a lot more.</p>
        </div>
        <div className="services-table-root">
          {/* <Paper> */}
            <Table >
              <TableHead>
                <TableRow >
                  <TableCell>
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort("Service")}
                    >
                      Services
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort("Residential")}
                    >
                      Residential
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort("Commercial")}
                    >
                      Commercial
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {orderBy(
                  this.state.services,
                  this.state.columnToSort,
                  this.state.sortDirection
                ).map(row => (
                  <TableRow className='services-text-body' key={row._id}>
                    <TableCell component="th" scope="row">
                      {row.Service}
                    </TableCell>
                    <TableCell align="right">
                      {row.Residential ? <CheckOutlined /> : ""}
                    </TableCell>
                    <TableCell align="right">
                      {row.Commercial ? <CheckOutlined /> : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          {/* </Paper> */}
        </div>
      </div>
    );
  }
}
