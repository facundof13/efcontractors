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
import ItemField from "./estimates-items-field";

const invertDirection = {
  asc: "desc",
  desc: "asc"
};

export default class CustomerItemTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = { columnToSort: "item", sortDirection: "desc" };
  }

  render() {
    console.log(this.props.headerRow);
    return (
      <Paper className="item-table">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
              {this.props.headerRow.map(item => (
                  <TableSortLabel key={item}> {item} </TableSortLabel>
                ))}
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </Paper>
    );
  }
}
