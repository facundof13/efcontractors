import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  IconButton
} from "@material-ui/core";
import InsertDriveFileOutlined from "@material-ui/icons/InsertDriveFileOutlined";
import orderBy from "lodash/orderBy";
import prettifyDate from "../helperComponents/prettify-date";

const invertDirection = {
  asc: "desc",
  desc: "asc"
};

const getItemToSort = {
  Title: "title",
  Expiration: "expiration",
  Total: "total",
  "Date Created": "date"
};

export default class CustomerItemTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = { columnToSort: "item", sortDirection: "desc" };
    this.handleSort = this.handleSort.bind(this);
    this.createPdf = this.createPdf.bind(this);
  }

  handleSort(item) {
    this.setState(prevState => ({
      columnToSort: getItemToSort[item],
      sortDirection:
        prevState.columnToSort === getItemToSort[item]
          ? invertDirection[prevState.sortDirection]
          : "asc"
    }));
  }

  createPdf(row) {
    console.log(this.props.customerInfo);
    console.log(row);
  }

  render() {
    return (
      <div>
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                {this.props.headerRow.map(item => (
                  <TableCell
                    align={item === "Title" ? "left" : "right"}
                    key={item}
                  >
                    <TableSortLabel
                      direction={this.state.sortDirection}
                      onClick={() => this.handleSort(item)}
                    >
                      {item}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {orderBy(
                this.props.items,
                this.state.columnToSort,
                this.state.sortDirection
              ).map(row => (
                <TableRow
                  // onClick={() => this.logItems(row)}
                  hover={true}
                  key={row.title}
                >
                  <TableCell align="left">{row.title}</TableCell>
                  <TableCell align="right">
                    {prettifyDate(row.expiration)}
                  </TableCell>
                  <TableCell align="right">${row.total}</TableCell>
                  <TableCell align="right">{prettifyDate(row.date)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => this.createPdf(row)}>
                      <InsertDriveFileOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}
