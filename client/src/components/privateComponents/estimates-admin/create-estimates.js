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
    this.state = { services: [], numItems: 1, itemsField: [] };
    this.handleChange = this.handleChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.renderItems = this.renderItems.bind(this);
  }

  componentDidMount() {
    this.getServices().then(() => {
      this.renderItems();
    });
  }

  renderItems() {
    //dont pass the num, instead pass its index in the array youre pusshing maybe??
    //change the way things are added to array
    var item = (
      <ItemField
        key={this.state.numItems}
        removeItem={this.removeItem}
        num={this.state.numItems}
        services={this.state.services}
      />
    );
    this.setState({ itemsField: [...this.state.itemsField, item] });
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
    console.log("newItems");
    this.setState(
      prevState => ({
        numItems: prevState.numItems + 1,
      })
      ,
      () => {
        this.renderItems();
      }
    );
    // this.setState(prevState => { numItems: prevState.numItems++ });
  }

  removeItem(num) {
    num = num - 1;
    this.setState(prevState => ({
      itemsField: prevState.itemsField.filter(function(item, index) {
        return !(index === (num))
      }),
      numItems: (prevState.numItems - 1),
    }), () =>  console.log(this.state));
  }

  render() {
    console.log(this.state);
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
      </div>
    );
  }
}
