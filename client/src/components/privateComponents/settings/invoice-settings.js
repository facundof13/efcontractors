import React from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import Axios from "axios";
export default class InvoiceSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      company: "",
      address: "",
      cityState: "",
      zip: "",
      taxAmt: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    Axios.get("/admin/invoicesettings").then(res => {
      //   console.log(res.data)
      this.setState({
        company: res.data.company,
        address: res.data.address,
        cityState: res.data.cityState,
        zip: res.data.zip,
        taxAmt: res.data.taxAmt
      });
    });
  }

  handleChange(e) {
    console.log(e.target.name);
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSave() {
    Axios.post("/admin/invoicesettings", {
      settings: {
        company: this.state.company,
        address: this.state.address,
        cityState: this.state.cityState,
        zip: this.state.zip,
        taxAmt: this.state.taxAmt
      }
    }).then(window.location.reload());
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Typography color="secondary" component="span" variant="h5">
          <h5>Invoice Settings</h5>
        </Typography>

        <div>
          <TextField
            value={this.state.company}
            name="company"
            label="Company"
            color="secondary"
            onChange={this.handleChange}
          />
          <TextField
            value={this.state.address}
            name="address"
            label="Address"
            color="secondary"
            onChange={this.handleChange}
          />
          <TextField
            value={this.state.cityState}
            name="cityState"
            label="City, State"
            color="secondary"
            onChange={this.handleChange}
          />
          <TextField
            value={this.state.zip}
            name="zip"
            label="Zip"
            color="secondary"
            onChange={this.handleChange}
          />
          <TextField
            value={this.state.taxAmt}
            name="taxAmt"
            label="Tax Amount"
            color="secondary"
            onChange={this.handleChange}
          />
        </div>
        <div>
          <Button
            className="btn-login"
            variant="outlined"
            color="secondary"
            onClick={this.handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}
