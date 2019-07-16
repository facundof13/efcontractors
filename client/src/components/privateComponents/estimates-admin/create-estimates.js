import React from "react";
import { Typography } from "@material-ui/core";
import {
  TextField,
  Button
  // Checkbox,
  // FormControlLabel
} from "@material-ui/core";
import Axios from "axios";
import ItemField from "./estimates-items-field";
export default class CreateEstimate extends React.Component {
  constructor() {
    super();
    this.state = {
      services: [],
      itemsField: [],
      items: [],
      name: "",
      title: "",
      email: "",
      address: "",
      cityState: "",
      zip: "",
      expiration: "",
      itemError: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.submitInvoice = this.submitInvoice.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.filterItemsArr = this.filterItemsArr.bind(this);
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
        helperText={this.state.helperText}
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
    }));
  }

  filterItemsArr() {
    var arrCopy = [...this.state.items];
    var arrDatesunFiltered = [];
    var arrDates = [];
    var cleanArr = [];
    for (let i = 0; i < arrCopy.length; i++) {
      arrDatesunFiltered.push(arrCopy[i].num);
    }

    arrDates = [...new Set(arrDatesunFiltered)];
    for (let x = 0; x < arrDates.length; x++) {
      for (let y = arrCopy.length - 1; y >= 0; y--) {
        if (arrDates[x] === arrCopy[y].num) {
          cleanArr.push(arrCopy[y]);
          break;
        }
      }
    }
    this.setState(
      {
        items: cleanArr
      }
      // ()=>console.log(this.state)u
    );
  }

  submitInvoice() {
    this.filterItemsArr();
    this.setState({
      helperText: "Required"
    });

    if (
      this.state.name !== "" &&
      this.state.address !== "" &&
      this.state.cityState !== "" &&
      this.state.zip !== "" &&
      this.state.expiration !== "" &&
      this.state.title !== "" &&
      this.state.email !== ""
    ) {
      if (this.state.zip.match(/\d{5}/)) {
        console.log("zip ok");
      }
      console.log("all fields filled");
    }
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
              value={this.state.name}
              helperText={this.state.name === "" ? this.state.helperText : ""}
              name="name"
              type="text"
              color="secondary"
              placeholder="Client Name"
              onChange={this.handleChange}
            />
            <TextField
              value={this.state.title}
              helperText={this.state.title === "" ? this.state.helperText : ""}
              name="title"
              type="text"
              color="secondary"
              placeholder="Title"
              onChange={this.handleChange}
            />
            <TextField
              value={this.state.email}
              helperText={this.state.email === "" || !this.state.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/) ? this.state.helperText : ""}
              name="email"
              type="email"
              color="secondary"
              placeholder="Client Email"
              onChange={this.handleChange}
            />
            <TextField
              value={this.state.address}
              helperText={
                this.state.address === "" ? this.state.helperText : ""
              }
              name="address"
              type="text"
              color="secondary"
              placeholder="Client Street Address"
              onChange={this.handleChange}
            />
            <TextField
              value={this.state.cityState}
              helperText={
                this.state.cityState === "" || !this.state.cityState.match(/([A-Za-z]+(?: [A-Za-z]+)*),? ([A-Z]{2})/) ? this.state.helperText : ""
              }
              name="cityState"
              type="text"
              color="secondary"
              placeholder="Client City, State"
              onChange={this.handleChange}
            />
            <TextField
              value={this.state.zip}
              helperText={this.state.zip === "" || !this.state.zip.match(/\d{5}/) ? this.state.helperText : ""}
              name="zip"
              type="text"
              maxLength="2"
              color="secondary"
              placeholder="Client Zip Code"
              onChange={this.handleChange}
            />
            <TextField
              value={this.state.expiration}
              helperText={
                this.state.expiration === "" || !this.state.expiration.match(/\d{1,3}/) ? this.state.helperText : ""
              }
              name="expiration"
              type="number"
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
