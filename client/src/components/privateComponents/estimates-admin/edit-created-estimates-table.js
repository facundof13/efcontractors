import React from "react";
import update from "immutability-helper";
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
  IconButton,
  Select,
  MenuItem
} from "@material-ui/core";
import Axios from "axios";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { subtractDates, prettifyDate, addDates } from "../helperComponents/prettify-date";

export default class EditCreatedEstimatesTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectItem: null,
      services: [],
      date: this.props.estimateToEdit.date,
      contractAttached: this.props.estimateToEdit.contractAttached,
      expiration: subtractDates(
        this.props.estimateToEdit.date,
        this.props.estimateToEdit.expiration
      ),
      invoice: this.props.estimateToEdit.invoice,
      title: this.props.estimateToEdit.title,
      items: [...this.props.estimateToEdit.items]
    };

    this.handleChange = this.handleChange.bind(this);
    this.render = this.render.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getServices = this.getServices.bind(this);
    this.getSelector = this.getSelector.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  componentDidMount() {
    this.getServices();
  }

  getSelector(item, index) {
    return (
      <FormControl className="item-select">
        <Select
          className="edit-estimate-item-selector"
          onChange={event => this.handleChange(event, index)}
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

  handleChange(event, index) {
    let key = event.target.name;
    let value = event.target.value;
    let stateToChange = [...this.state.items];
    if (event.target.name === "title" || event.target.name === "expiration") {
      this.setState({ [key]: value });
    } else if (
      event.target.name === "contractAttached" ||
      event.target.name === "invoice"
    ) {
      this.setState({ [key]: event.target.checked });
    } else if (event.target.name === "tax" || event.target.name === "expense") {
      stateToChange[index][key] = event.target.checked;
      this.setState({
        items: stateToChange
      });
    } else {
      stateToChange[index][key] = value;
      this.setState({
        items: stateToChange
      });
    }
  }

  cancelEdit() {
    this.props.cancelEdit()
  }

  handleSave() {
    let total = 0
    this.state.items.forEach(item => {
      total += Number(item.amount.replace('$', ''))
    })

    let object = {
      items: [...this.state.items],
      invoice: this.state.invoice,
      contractAttached: this.state.contractAttached,
      total: total,
      expiration: addDates(this.state.date, this.state.expiration),
      title: this.state.title,
      date: this.state.date
    }
    this.props.handleSave(object)
  }

  render() {
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
                  onChange={event => this.handleChange(event)}
                  value={this.state.title}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="expiration"
                  onChange={event => this.handleChange(event)}
                  value={this.state.expiration}
                />
              </TableCell>
              <TableCell>
                <FormControlLabel
                  name="contractAttached"
                  className="estimate-checkbox"
                  control={<Checkbox />}
                  checked={this.state.contractAttached}
                  onChange={event => this.handleChange(event)}
                />
              </TableCell>
              <TableCell>
                <FormControlLabel
                  checked={this.state.invoice}
                  name="invoice"
                  className="estimate-checkbox"
                  control={<Checkbox />}
                  onChange={event => this.handleChange(event)}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  title="Save estimate"
                  onClick={this.handleSave}
                >
                  <SaveOutlinedIcon />
                </IconButton>
                <IconButton
                  size="small"
                  title="Cancel edit"
                  onClick={this.cancelEdit}
                >
                  <CancelOutlinedIcon />
                </IconButton>
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
            {this.state.items.map(function(item, index) {
              return (
                <TableRow key={item.num}>
                  <TableCell>{this.getSelector(item.item, index)}</TableCell>
                  <TableCell>
                    <TextField
                      name="description"
                      onChange={event => this.handleChange(event, index)}
                      value={item.description}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="quantity"
                      onChange={event => this.handleChange(event, index)}
                      value={item.quantity}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="amount"
                      onChange={event => this.handleChange(event, index)}
                      value={item.amount}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      checked={item.tax}
                      name="tax"
                      className="estimate-checkbox"
                      control={<Checkbox />}
                      onChange={event => this.handleChange(event, index)}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      checked={item.expense}
                      name="expense"
                      className="estimate-checkbox"
                      control={<Checkbox />}
                      onChange={event => this.handleChange(event, index)}
                    />
                  </TableCell>
                </TableRow>
              );
            }, this)}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}
