import React from "react";
import {
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
import orderBy from "lodash/orderBy";

const invertDirection = {
  asc: "desc",
  desc: "asc"
};

const getItemToSort = {
  Item: "item",
  Description: "description",
  Quantity: "quantity",
  Amount: "amount",
  Tax: "tax",
  Expense: "expense"
};

export default class CustomerItemTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = { columnToSort: "item", sortDirection: "desc" };
    this.handleSort = this.handleSort.bind(this);
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

  render() {
    console.log(this.props.items);
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
              </TableRow>
            </TableHead>
              <TableBody>
                {this.props.items.map(row => (
                  <TableRow
                    // onClick={() => this.logItems(row)}
                    hover={true}
                    key={row.total}
                  >
                    <TableCell align="left">{row.title}</TableCell>
                    <TableCell align="right">{row.expiration}</TableCell>
                    <TableCell align="right">${row.total}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}
