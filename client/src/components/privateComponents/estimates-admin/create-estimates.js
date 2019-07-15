import React from "react";
import { Typography } from "@material-ui/core";
import { TextField, Button, Checkbox, FormControlLabel } from "@material-ui/core";
import Axios from "axios";

export default class CreateEstimate extends React.Component {
  constructor() {
    super();
    this.state = {services: [],}
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getServices()
  }


  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    document.getElementById('create-form').reset()
  }

  getServices() {
    Axios.get('/admin/invoiceServices')
    .then(res => {
      this.setState({services: res.data})
      console.log(this.state.services)
    })
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
        <form>
          <select name="service-item">
          {this.state.services ? this.state.services.map(item => (
            <option value={item} key={item}>{item}</option>
          )) : ""}
          </select>
          <TextField
            name="item-description"
            type="text"
            color="secondary"
            placeholder="Description"
          />
          <FormControlLabel
          color='secondary'
          value="tax"
          control={<Checkbox color="secondary" />}
          label="Tax"
          labelPlacement="end"
        />
        </form>
      </div>
    );
  }
}
