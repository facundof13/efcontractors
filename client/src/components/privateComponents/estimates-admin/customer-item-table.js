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
  Grid
} from "@material-ui/core";
import orderBy from "lodash/orderBy";

const invertDirection = {
  asc: "desc",
  desc: "asc"
};

const getItemToSort = {
    Item: 'item',
    Description: 'description',
    Quantity: 'quantity',
    Amount: 'amount',
    Tax: 'tax',
    Expense: 'expense',
}

export default class CustomerItemTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = { columnToSort: "item", sortDirection: "desc" };
    this.handleSort = this.handleSort.bind(this);
  }

  handleSort(item) {
    this.setState(
      prevState => ({
        columnToSort: getItemToSort[item],
        sortDirection:
          prevState.columnToSort === getItemToSort[item]
            ? invertDirection[prevState.sortDirection]
            : "asc"
      }),
    );
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
                    align={item === "Item" ? "left" : "right"}
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
              {orderBy(
              this.props.items,
              this.state.columnToSort,
              this.state.sortDirection
            ).map(row => (
              <TableRow
                // onClick={() => this.logItems(row)}
                hover={true}
                key={row.num}
              >
                  <TableCell align='left'>{row.item}</TableCell>
                  <TableCell align='right'>{row.description}</TableCell>
                  <TableCell align='right'>{row.quantity}</TableCell>
                  <TableCell align='right'>{row.amount}</TableCell>
                  <TableCell align='right'>{row.tax ? "yes" : "no"}</TableCell>
                  <TableCell align='right'>{row.expense ? "yes" : "no"}</TableCell>

            </TableRow>
            ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}
