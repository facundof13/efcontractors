import React from "react";
import {
  Typography,
  Divider,
  Tabs,
  Tab,
  AppBar,
  TabPanel
} from "@material-ui/core";
import CompanyInformation from "./company-information";
import ManageServices from "./manage-services";
import InvoiceSettings from "./invoice-settings";

const values = {
  "COMPANY SETTINGS": "one",
  "INVOICE SETTINGS": "two",
  "MANAGE SERVICES": "three"
};
export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "one"
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, value) {
    this.setState({ value: value });
  }
  render() {
    return (
      <div className="settings-root">
        <Typography color="secondary" component="span" variant="h4">
          <h4>Settings</h4>
        </Typography>
        <AppBar position="static" className='tabs-bar'>
          <Tabs value={this.state.value} onChange={this.handleChange} centered={true}>
            <Tab value="one" label="Company Settings" />
            <Tab value="two" label="Invoice Settings" />
            <Tab value="three" label="Manage Services" />
          </Tabs>
        </AppBar>

        {this.state.value === "one" ? <CompanyInformation /> : ""}
        {this.state.value === "two" ? <InvoiceSettings /> : ""}
        {this.state.value === "three" ? <ManageServices /> : ""}

        {/* 
        <TabPanel value={this.state.value} index='one'>Company Settings</TabPanel>
        <TabPanel value={this.state.value} index='one'>Invoice Settings</TabPanel>
        <TabPanel value={this.state.value} index='one'>Manage Services</TabPanel> */}

        {/* <Divider className='divider' />
        <CompanyInformation />
        <Divider className='divider' />
        <InvoiceSettings />
        <Divider className='divider' />
        <ManageServices />
        <Divider className='divider' /> */}
      </div>
    );
  }
}
