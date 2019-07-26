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
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import SendOutlined from "@material-ui/icons/SendOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import orderBy from "lodash/orderBy";
import prettifyDate from "../helperComponents/prettify-date";
import EditCreatedEstimatesTable from "./edit-created-estimates-table";
import Axios from "axios";

const invertDirection = {
  asc: "desc",
  desc: "asc"
};

const getItemToSort = {
  Title: "title",
  Expiration: "expiration",
  Total: "total",
  "Date Created": "date",
  Invoice: "invoice"
};

export default class CustomerEstimateTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnToSort: "item",
      sortDirection: "desc",
      currentlyEditing: false,
      estimateToEdit: []
    };
    this.handleSort = this.handleSort.bind(this);
    this.createPdf = this.createPdf.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleEstimateSave = this.handleEstimateSave.bind(this);
    this.sendEstimate = this.sendEstimate.bind(this);
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

  handleEdit(row) {
    this.setState({
      currentlyEditing: true,
      estimateToEdit: JSON.parse(JSON.stringify(row))
    });
  }

  sendEstimate(row) {
    console.log(row)
  }

  cancelEdit() {
    this.setState({ currentlyEditing: false, estimateToEdit: [] });
  }

  handleEstimateSave(estimate) {
    this.props.handleSave(estimate);
    this.setState({ currentlyEditing: false, estimateToEdit: [] });
  }

  handleEstimateDelete(estimate) {
    console.log(estimate)
  }

  render() {
    return (
      <div>
        {this.state.currentlyEditing ? (
          <EditCreatedEstimatesTable
            estimateToEdit={this.state.estimateToEdit}
            cancelEdit={this.cancelEdit}
            handleSave={this.handleEstimateSave}
          />
        ) : (
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
                    <TableCell align="right">
                      {prettifyDate(row.date)}
                    </TableCell>
                    <TableCell align="right">
                      {row.invoice ? "Yes" : "No"}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        title="Edit estimate"
                        onClick={() => this.handleEdit(row)}
                      >
                        <CreateOutlinedIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        title="Send estimate"
                        onClick={() => this.sendEstimate(row)}
                      >
                        <SendOutlined />
                      </IconButton>
                      <IconButton
                        size="small"
                        title="Show pdf"
                        onClick={() => this.createPdf(row)}
                      >
                        <InsertDriveFileOutlined />
                      </IconButton>
                      <IconButton
                        size="small"
                        title="Delete estimate"
                        onClick={() => this.props.handleDelete(row)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </div>
    );
  }
}
