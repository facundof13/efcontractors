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
import ReceiptOutlined from "@material-ui/icons/ReceiptOutlined";
import PaymentOutlined from "@material-ui/icons/PaymentOutlined";
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
  Total: "total",
  Expiration: "expiration",
  "Date Created": "date",
  Invoice: "invoice",
  "Paid Date": "paidDate",
  Paid: "paid",
  Status: "paid"
};

export default class CustomerEstimateTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnToSort: "item",
      sortDirection: "desc",
      currentlyEditing: false,
      estimateToEdit: [],
      imgUrl: ""
    };
    this.handleSort = this.handleSort.bind(this);
    this.createPdf = this.createPdf.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleEstimateSave = this.handleEstimateSave.bind(this);
    this.sendEstimate = this.sendEstimate.bind(this);
    this.markPaid = this.markPaid.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    Axios.get("/admin/imgurl").then(res => {
      this.setState({
        imgUrl: res.data[0].img
      });
    });
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

  handleEdit(row) {
    this.setState({
      currentlyEditing: true,
      estimateToEdit: JSON.parse(JSON.stringify(row))
    });
  }

  sendEstimate(row) {
    if (window.confirm(`Send an email to ${this.props.customerInfo.email}?`)) {
      Axios.post("/admin/generatePDF", {
        client: this.props.customerInfo,
        estimate: row,
        imgUrl: this.state.imgUrl
      }).then(pdf => {
        Axios.post("/admin/sendemail", {
          estimate: row,
          client: this.props.customerInfo,
          pdf: pdf.data
        }).then(res => {
          window.alert("Email sent!");
        });
      });
    }
  }

  cancelEdit() {
    this.setState({ currentlyEditing: false, estimateToEdit: [] });
  }

  handleEstimateSave(estimate) {
    this.props.handleSave(estimate);
    this.setState({ currentlyEditing: false, estimateToEdit: [] });
  }

  handleEstimateDelete(estimate) {
    console.log(estimate);
  }

  async createPdf(row) {
    Axios.post("/admin/generatePDF", {
      client: this.props.customerInfo,
      estimate: row,
      imgUrl: this.state.imgUrl
    }).then(pdf => {
      var x = window.open();
      x.document.getElementsByTagName("html")[0].style =
        "overflow: hidden; margin-bottom:20px;";
      var iframe = x.document.createElement("iframe");
      iframe.width = "100%";
      iframe.height = "98%";
      iframe.style = "overflow: hidden";
      iframe.src = pdf.data; //data-uri content here
      x.document.body.appendChild(iframe);
    });
  }

  markPaid(row) {
    this.props.markEstimatePaid(row);
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
          <Paper className="estimates-table">
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
                  <TableRow hover={true} key={row.date}>
                    <TableCell align="left">{row.title}</TableCell>
                    <TableCell align="right">${row.total}</TableCell>
                    <TableCell align="right">
                      {prettifyDate(row.expiration)}
                    </TableCell>
                    <TableCell align="right">
                      {prettifyDate(row.date)}
                    </TableCell>
                    <TableCell align="right">
                      {row.paid
                        ? "Receipt"
                        : row.invoice
                        ? row.attachContract
                          ? "Invoice w/ contract"
                          : "Invoice w/o contract"
                        : "Estimate"}
                    </TableCell>
                    <TableCell align="right">
                      {row.invoice ? (row.paid ? "Yes" : "No") : "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      {row.paid ? prettifyDate(row.paidDate) : "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      {row.paid ? (
                        ""
                      ) : (
                        <IconButton
                          size="small"
                          title="Edit estimate"
                          onClick={() => this.handleEdit(row)}
                        >
                          <CreateOutlinedIcon />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        title="Send estimate"
                        onClick={() => this.sendEstimate(row)}
                      >
                        <SendOutlined />
                      </IconButton>
                      {row.paid ? (
                        ""
                      ) : (
                        <IconButton
                          size="small"
                          title="Show pdf"
                          onClick={() => this.createPdf(row)}
                        >
                          <InsertDriveFileOutlined />
                        </IconButton>
                      )}
                      {/* If its a paid invoice, show the receipt, if its an unpaid invoice show the payment button */}
                      {/* Else, don't show anything */}
                      {row.invoice ? (
                        row.paid ? (
                          <IconButton
                            size="small"
                            title="Print Receipt"
                            onClick={() => this.createPdf(row)}
                          >
                            <ReceiptOutlined />
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            title="Mark paid"
                            onClick={() => this.markPaid(row)}
                          >
                            <PaymentOutlined />
                          </IconButton>
                        )
                      ) : (
                        ""
                      )}
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
