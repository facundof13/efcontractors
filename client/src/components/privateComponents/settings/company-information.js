import React from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import Axios from "axios";
export default class CompanyInformation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      telephone: "",
      email: "",
      company: "",
      cityStateZip: "",
      address: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    Axios.get("/admin/settings").then(res => {
      this.setState({
        telephone: res.data.telephone,
        email: res.data.email,
        company: res.data.company,
        cityStateZip: res.data.cityStateZip,
        address: res.data.address
      });
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSave() {
    Axios.post("/admin/settings", {
      settings: {
        telephone: this.state.telephone,
        email: this.state.email,
        company: this.state.company,
        cityStateZip: this.state.cityStateZip,
        address: this.state.address
      }
    }).then(window.location.reload());
  }

  render() {
    return (
      <div className='company-information'>
        <div>
          <Typography color="secondary" component="span" variant="h5">
            <h5>Lookup Information</h5>
          </Typography>
          <TextField
            value={this.state.telephone}
            name="telephone"
            label="Telephone"
            color="secondary"
            onChange={this.handleChange}
          />
          <TextField
            value={this.state.email}
            name="email"
            label="Email"
            color="secondary"
            onChange={this.handleChange}
          />
          <TextField
            value={this.state.company}
            name="company"
            label="Company"
            color="secondary"
            onChange={this.handleChange}
          />
          <TextField
            value={this.state.cityStateZip}
            name="cityStateZip"
            label="City, State Zip"
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
