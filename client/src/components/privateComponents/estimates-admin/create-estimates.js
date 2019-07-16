import React from "react";
import { Typography } from "@material-ui/core";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import Axios from "axios";
import ItemField from "./estimates-items-field";
export default class CreateEstimate extends React.Component {
  constructor() {
    super();
    this.state = { services: [], itemsField: [], items: [], name: '', title: '', email: '', address: '', cityState: '', zip: '', expiration: '' };
    this.handleChange = this.handleChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.submitInvoice = this.submitInvoice.bind(this);
    this.updateItems = this.updateItems.bind(this);
  }

  componentDidMount() {
    this.getServices().then(() => {
      this.addItem();
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    document.getElementById("create-form").reset();
  }

  getServices() {
    return new Promise((resolve, reject) => {
      Axios.get("/admin/invoiceServices").then(res => {
        this.setState({ services: res.data });
        resolve();
      });
    });
  }

  addItem() {
    let date = Date.now();
    let newItem = (
      <ItemField
        key={date}
        num={date}
        removeItem={this.removeItem}
        services={this.state.services}
        updateItems={this.updateItems}
      />
    );
    this.setState(prevState => ({
      itemsField: [...prevState.itemsField, newItem]
    }));
  }

  removeItem(date) {
    if (this.state.itemsField.length === 1) {
      window.alert("Cannot remove first item");
    } else {
      this.setState(prevState => ({
        itemsField: prevState.itemsField.filter(function(item) {
          return date != item.key;
        })
      }));
    }
  }

  updateItems(itemArr) {
    this.setState(prevState => ({
      items: [...prevState.items, itemArr]
    }))
  }

  submitInvoice() {
    console.log(this.state)
  }


  render() {
    return (
      <div>
        <Typography variant="h5" component="span" color="secondary">
          <h5>Create an Estimate</h5>
        </Typography>
        <div>
          <form autoComplete="off" id="create-form">
            <TextField
              name="name"
              type="text"
              color="secondary"
              placeholder="Client Name"
              onChange={this.handleChange}
            />
            <TextField
              name="title"
              type="text"
              color="secondary"
              placeholder="Title"
              onChange={this.handleChange}
            />
            <TextField
              name="email"
              type="email"
              color="secondary"
              placeholder="Client Email"
              onChange={this.handleChange}
            />
            <TextField
              name="address"
              type="text"
              color="secondary"
              placeholder="Client Street Address"
              onChange={this.handleChange}
            />
            <TextField
              name="cityState"
              type="text"
              color="secondary"
              placeholder="Client City, State"
              onChange={this.handleChange}
            />
            <TextField
              name="zip"
              type="text"
              pattern="[0-9]{5}"
              color="secondary"
              placeholder="Client Zip Code"
              onChange={this.handleChange}
            />
            <TextField
              name="expiration"
              type="text"
              pattern="[0-9]"
              color="secondary"
              placeholder="Expires in x days"
              onChange={this.handleChange}
            />
          </form>
        </div>
        <Button onClick={this.addItem}>Add Item</Button>
        {this.state.itemsField}
        <Button onClick={this.submitInvoice}>Submit Invoice</Button>
      </div>
    );
  }
}
