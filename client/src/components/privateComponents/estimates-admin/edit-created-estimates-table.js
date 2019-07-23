import React from "react";
import {
  TableHead,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  FormControlLabel,
  Checkbox,
  InputLabel,
  FormControl,
  Select,
  MenuItem
} from "@material-ui/core";
import Axios from "axios";
import { subtractDates, prettifyDate } from "../helperComponents/prettify-date";

export default class EditCreatedEstimatesTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectItem: null,
      services: [],
      contractAttached: this.props.estimateToEdit.contractAttached,
      expiration: this.props.estimateToEdit.expiration,
      invoice: this.props.estimateToEdit.invoice,
      title: this.props.estimateToEdit.title,
      items: this.props.estimateToEdit.items
    };

    this.handleChange = this.handleChange.bind(this);
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getServices = this.getServices.bind(this);
    this.getSelector = this.getSelector.bind(this);
  }

  componentDidMount() {
    this.getServices();
  }

  getSelector(item) {
    console.log(this.state);
    console.log(item);
    return (
      <FormControl className="item-select">
        <Select
          //   className="estimate-item-select-width"
          onChange={this.handleChange}
          value={item}
          displayEmpty={true}
          name="item"
        >
          <MenuItem value={item}>{item}</MenuItem>
          {this.state.services.map(service =>
            service === item ? (
              ""
            ) : (
              <MenuItem
                value={service}
                selected={service === item}
                key={service}
              >
                {service}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
    );
  }

  getServices() {
    return new Promise((resolve, reject) => {
      Axios.get("/admin/invoiceServices").then(res => {
        this.setState({ services: res.data });
        resolve();
      });
    });
  }

  handleChange(event, isChecked) {
    if (
      event.target.name === "contractAttached" ||
      event.target.name === "invoice"
    ) {
      console.log(event.target.name, isChecked);
    }
    console.log(event.target.name, event.target.value);
  }

  render() {
    console.log(this.state);
    return (
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Expiration</TableCell>
              <TableCell>Contract</TableCell>
              <TableCell>Invoice</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  name="title"
                  onChange={this.handleChange}
                  value={this.props.estimateToEdit.title}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="expiration"
                  onChange={this.handleChange}
                  value={subtractDates(
                    this.props.estimateToEdit.date,
                    this.props.estimateToEdit.expiration
                  )}
                />
              </TableCell>
              <TableCell>
                <FormControlLabel
                  checked={this.props.estimateToEdit.contractAttached}
                  name="contractAttached"
                  className="estimate-checkbox"
                  control={<Checkbox />}
                  onChange={this.handleChange}
                />
              </TableCell>
              <TableCell>
                <FormControlLabel
                  checked={this.props.estimateToEdit.invoice}
                  name="invoice"
                  className="estimate-checkbox"
                  control={<Checkbox />}
                  onChange={this.handleChange}
                />
              </TableCell>
            </TableRow>
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Expense</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.items.map(item => (
              <TableRow key={item.num}>
                <TableCell>{this.getSelector(item.item)}</TableCell>
                <TableCell>
                  <TextField
                    name="description"
                    onChange={this.handleChange}
                    value={item.description}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}
