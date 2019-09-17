import React from "react";
import { Tabs, Tab, AppBar } from "@material-ui/core";

//components
import EstimatesTable from "./estimates-table";
import CreateEstimate from "./create-estimates";

export default class Estimates extends React.Component {
  constructor() {
    super();
    this.state = { showCreateEstimate: false, showTable: true, value: "one" };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, val) {
    this.setState({ value: val });
  }

  render() {
    return (
      <div>
        <AppBar position="static" className="tabs-bar">
          <Tabs
            value={this.state.value}
            onChange={(e, val) => this.handleChange(e, val)}
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
