import React from "react";
import Typography from "@material-ui/core/Typography";
import { Button, Tabs, Tab, AppBar } from "@material-ui/core";

//components
import EstimatesTable from "./estimates-table";
import CreateEstimate from "./create-estimates";

export default class Estimates extends React.Component {
  constructor() {
    super();
    this.state = { showCreateEstimate: false, showTable: true, value: "one" };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, value) {
    this.setState({ value: value });
  }

  render() {
    return (
      <div>
        <Typography component="span" variant="h4" color="secondary">
          <h4>Manage Estimates</h4>
        </Typography>
        <AppBar position="static" className="tabs-bar">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            centered={true}
          >
            <Tab value="one" label="Create Estimates" />
            <Tab value="two" label="Manage Estimates" />
          </Tabs>
        </AppBar>

        {this.state.value === "one" ? <CreateEstimate /> : ""}
        {this.state.value === "two" ? <EstimatesTable /> : ""}
      </div>
    );
  }
}
