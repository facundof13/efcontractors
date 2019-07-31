import React from "react";
import { PDFViewer } from "@react-pdf/renderer";

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
import { generatePDF, similarity } from "../helperComponents/pdfGenerator";
import PdfPage from "./pdf-page";
import { pdf } from "@react-pdf/renderer";
const invertDirection = {
  asc: "desc",
  desc: "asc"
};

const getItemToSort = {
  Title: "title",
  Total: "total",
  Expiration: "expiration",
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
    this.markPaid = this.markPaid.bind(this);
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
    console.log(row);
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

  blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function(e) {
      callback(e.target.result);
    };
    a.readAsDataURL(blob);
  }

  async createPdf(row) {
    let res = await Axios.get("/admin/imgurl");
    var img = res.data[0].img;

    pdf(<PdfPage client={this.props.customerInfo} estimate={row} imgUrl={img} />)
      .toBlob()
      .then(res => {
        this.blobToDataURL(res, data => {
          var x = window.open();
          x.document.getElementsByTagName("html")[0].style =
            "overflow: hidden; margin-bottom:20px;";
          var iframe = x.document.createElement("iframe");
          iframe.width = "100%";
          iframe.height = "98%";
          iframe.style = "overflow: hidden";
          iframe.src = data; //data-uri content here
          x.document.body.appendChild(iframe);
        });
      });

    // let res = await Axios.post("/admin/generatePdf", {client: this.props.customerInfo, estimate: row});
    // var pdfData = (`data:application/pdf;base64,${res.data}`)
    // console.log(htmlstring);
    // var doc = await generatePDF(this.props.customerInfo, row);
    // // save new pdf to db
    // // console.log(doc)
    // // console.log(row.pdfLink)
    // // if (similarity(doc, row.pdfLink) < 90) {
    // Axios.post("/admin/updateestimate", {
    //   obj: {
    //     date: row.date,
    //     items: row.items,
    //     attachContract: row.attachContract,
    //     contractSpecs: row.contractSpecs,
    //     expiration: row.expiration,
    //     invoice: row.invoice,
    //     paymentSteps: row.paymentSteps,
    //     title: row.title,
    //     total: row.total,
    //     paid: row.paid,
    //     pdfLink: doc
    //   }
    // });
    // // }
  }

  markPaid(row) {
    // update each field in objects array
    this.props.markEstimatePaid(row);
    if (window.confirm(`Mark ${row.title} paid?`)) {
      Axios.post("/admin/updateestimate", {
        obj: {
          date: row.date,
          items: row.items,
          attachContract: row.attachContract,
          contractSpecs: row.contractSpecs,
          expiration: row.expiration,
          invoice: row.invoice,
          paymentSteps: row.paymentSteps,
          title: row.title,
          total: row.total,
          pdfLink: row.pdfLink,
          paid: true
        }
      });
    }
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
                    <TableCell align="right">${row.total}</TableCell>
                    <TableCell align="right">
                      {prettifyDate(row.expiration)}
                    </TableCell>
                    <TableCell align="right">
                      {prettifyDate(row.date)}
                    </TableCell>
                    <TableCell align="right">
                      {row.invoice
                        ? row.attachContract
                          ? "Invoice w/ contract"
                          : "Invoice w/o contract"
                        : "Estimate"}
                    </TableCell>
                    <TableCell align="right">
                      {row.invoice ? (row.paid ? "Yes" : "No") : "N/A"}
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
